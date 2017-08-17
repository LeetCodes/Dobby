"use strict";

let utils = require("../utils");
let log = require("npmlog");

let msgsRecv = 0;
let identity = function() {};

module.exports = function(defaultFuncs, api, ctx) {
  let currentlyRunning = null;
  let globalCallback = identity;

  let stopListening = function() {
    globalCallback = identity;
    if(currentlyRunning) {
      clearTimeout(currentlyRunning);
      currentlyRunning = null;
    }
  };

  let prev = Date.now();
  let tmpPrev = Date.now();
  let lastSync = Date.now();

  let form = {
    'channel' : 'p_' + ctx.userID,
    'seq' : '0',
    'partition' : '-2',
    'clientid' : ctx.clientID,
    'viewer_uid' : ctx.userID,
    'uid' : ctx.userID,
    'state' : 'active',
    'idle' : 0,
    'cap' : '8',
    'msgs_recv':msgsRecv
  };

  /**
   * Get an object maybe representing an event. Handles events it wants to handle
   * and returns true if it did handle an event (and called the globalCallback).
   * Returns false otherwise.
   */
  function handleMessagingEvents(event) {
    switch (event.event) {
      // "read_receipt" event triggers when other people read the user's messages.
      case 'read_receipt':
        globalCallback(null, utils.formatReadReceipt(event));
        return true;
      // "read event" triggers when the user read other people's messages.
      case 'read':
        globalCallback(null, utils.formatRead(event));
        return true;
      default:
        return false;
    }
  }

  let serverNumber = '0';

  function listen() {
    if(currentlyRunning == null || !ctx.loggedIn) {
      return;
    }

    form.idle = ~~(Date.now() / 1000) - prev;
    prev = ~~(Date.now() / 1000);
    let presence = utils.generatePresence(ctx.userID);
    ctx.jar.setCookie("presence=" + presence + "; path=/; domain=.facebook.com; secure", "https://www.facebook.com");
    utils.get("https://"+serverNumber+"-edge-chat.facebook.com/pull", ctx.jar, form)
    .then(utils.parseAndCheckLogin(ctx, defaultFuncs))
    .then(function(resData) {
      let now = Date.now();
      log.info("listen", "Got answer in " + (now - tmpPrev));
      tmpPrev = now;
      if(resData && resData.t === "lb") {
        form.sticky_token = resData.lb_info.sticky;
        form.sticky_pool = resData.lb_info.pool;
      }

      if(resData && resData.t === 'fullReload') {
        form.seq = resData.seq;
        delete form.sticky_pool;
        delete form.sticky_token;
        let form4 = {
          'lastSync' : ~~(lastSync/1000),
        };
        defaultFuncs.get("https://www.facebook.com/notifications/sync/", ctx.jar, form4)
        .then(utils.saveCookies(ctx.jar))
        .then(function() {
          lastSync = Date.now();
          let form = {
            'client' : 'mercury',
            'folders[0]': 'inbox',
            'last_action_timestamp' : ~~(Date.now() - 60)
          };
          defaultFuncs.post("https://www.facebook.com/ajax/mercury/thread_sync.php", ctx.jar, form)
          .then(function() {
            currentlyRunning = setTimeout(listen, 1000);
          });
        });
        return;
      }

      if(resData.ms) {
        msgsRecv += resData.ms.length;
        let atLeastOne = false;
        resData.ms.sort(function(a, b) {
          return a.timestamp - b.timestamp;
        }).forEach(function parsePackets(v) {
          switch (v.type) {
            // TODO: 'ttyp' was used before. It changed to 'typ'. We're keeping
            // both for now but we should remove 'ttyp' at some point.
            case 'ttyp':
            case 'typ':
              if(!ctx.globalOptions.listenEvents ||
                (!ctx.globalOptions.selfListen && v.from.toString() === ctx.userID)) {
                return;
              }

              return globalCallback(null, utils.formatTyp(v));
              break;
            case 'chatproxy-presence':
              // TODO: what happens when you're logged in as a page?
              if(!ctx.globalOptions.updatePresence) {
                return;
              }

              if (ctx.loggedIn) {
                for(let userID in v.buddyList) {
                  let formattedPresence = utils.formatProxyPresence(v.buddyList[userID], userID);
                  if(formattedPresence != null)
                  {
                    globalCallback(null, formattedPresence);
                  }
                }
                return;
              }

              break;
            case 'buddylist_overlay':
              // TODO: what happens when you're logged in as a page?
              if(!ctx.globalOptions.updatePresence) {
                return;
              }
              // There should be only one key inside overlay
              Object.keys(v.overlay).map(function(userID) {
                let formattedPresence = utils.formatPresence(v.overlay[userID], userID);
                if(ctx.loggedIn) {
                  return globalCallback(null, formattedPresence);
                }
              });
              break;
            case 'delta':
              if (ctx.globalOptions.pageID || (v.delta.class !== "NewMessage" && !ctx.globalOptions.listenEvents)) return

              if (v.delta.class === "NewMessage") {
                (function resolveAttachmentUrl(i) {
                  if (i === v.delta.attachments.length) {
                    let fmtMsg = utils.formatDeltaMessage(v);
                    return (!ctx.globalOptions.selfListen && fmtMsg.senderID === ctx.userID) ? undefined : globalCallback(null, fmtMsg);
                  } else {
                    if (v.delta.attachments[i].mercury.attach_type === 'photo') {
                      api.resolvePhotoUrl(v.delta.attachments[i].fbid, (err, url) => {
                        if (!err) v.delta.attachments[i].mercury.metadata.url = url;
                        return resolveAttachmentUrl(i + 1);
                      });
                    } else {
                      return resolveAttachmentUrl(i + 1);
                    }
                  }
                })(0)
                break;
              }

              if (v.delta.class === "ClientPayload") {
                let clientPayload = utils.decodeClientPayload(v.delta.payload);
                if (clientPayload && clientPayload.deltas) {
                  for (let i in clientPayload.deltas) {
                    let delta = clientPayload.deltas[i];
                    if (delta.deltaMessageReaction) {
                      globalCallback(null, {
                        type: "message_reaction",
                        threadID: delta.deltaMessageReaction.threadKey.threadFbId ? delta.deltaMessageReaction.threadKey.threadFbId : delta.deltaMessageReaction.threadKey.otherUserFbId,
                        messageID: delta.deltaMessageReaction.messageId,
                        reaction: decodeURIComponent(escape(delta.deltaMessageReaction.reaction)),
                        senderID: delta.deltaMessageReaction.senderId,
                        userID: delta.deltaMessageReaction.userId,
                        timestamp: v.ofd_ts
                      });
                    }
                  }
                  return;
                }
              }

              switch (v.delta.class) {
                case 'ReadReceipt':
                  return globalCallback(null, utils.formatDeltaReadReceipt(v.delta));
                case 'AdminTextMessage':
                  switch (v.delta.type) {
                    case 'change_thread_theme':
                    case 'change_thread_nickname':
                    case 'change_thread_icon':
                      break;
                    default:
                      return;
                  }
                case 'ThreadName':
                case 'ParticipantsAddedToGroupThread':
                case 'ParticipantLeftGroupThread':
                  let formattedEvent = utils.formatDeltaEvent(v.delta);
                  return (!ctx.globalOptions.selfListen && formattedEvent.author.toString() === ctx.userID || !ctx.loggedIn)
                    ? undefined
                    : globalCallback(null, formattedEvent);
              }

              break;
            case 'messaging':
              if (handleMessagingEvents(v)) {
                return;
              }
              break;
            case 'pages_messaging':
              if(!ctx.globalOptions.pageID ||
                v.event !== "deliver" ||
                (!ctx.globalOptions.selfListen && (v.message.sender_fbid.toString() === ctx.userID ||
                                                   v.message.sender_fbid.toString() === ctx.globalOptions.pageID)) ||
                v.realtime_viewer_fbid.toString() !== ctx.globalOptions.pageID) {
                return;
              }

              atLeastOne = true;
              if (ctx.loggedIn) {
                return globalCallback(null, utils.formatMessage(v));
              }
              break;
          }
        });

        if(atLeastOne) {
          // Send deliveryReceipt notification to the server
          let formDeliveryReceipt = {};

          resData.ms.filter(function(v) {
            return v.message && v.message.mid && v.message.sender_fbid.toString() !== ctx.userID;
          }).forEach(function(val, i) {
            formDeliveryReceipt["[" + i + "]"] = val.message.mid;
          });

          // If there's at least one, we do the post request
          if(formDeliveryReceipt["[0]"]) {
            defaultFuncs.post("https://www.facebook.com/ajax/mercury/delivery_receipts.php", ctx.jar, formDeliveryReceipt);
          }
        }
      }

      if(resData.seq) {
        form.seq = resData.seq;
      }
      if(resData.tr) {
        form.traceid = resData.tr;
      }
      if (currentlyRunning) {
        currentlyRunning = setTimeout(listen, Math.random() * 200 + 50);
      }
      return;
    })
    .catch(function(err) {
      if (err.code === 'ETIMEDOUT') {
        log.info("listen", "Suppressed timeout error.");
      } else if (err.code === 'EAI_AGAIN') {
        serverNumber = (~~(Math.random() * 6)).toString();
      } else {
        log.error("listen", err);
        globalCallback(err);
      }
      if (currentlyRunning) {
        currentlyRunning = setTimeout(listen, Math.random() * 200 + 50);
      }
    });
  }

  return function(callback) {
    globalCallback = callback;

    if (!currentlyRunning) {
      currentlyRunning = setTimeout(listen, Math.random() * 200 + 50, callback);
    }

    return stopListening;
  };
};