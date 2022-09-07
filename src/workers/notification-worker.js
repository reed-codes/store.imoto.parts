// worker.js
const workercode = () => {
    let token = "";
    let started = false;
    let conn, isOnLine, connectE, interval;
    var last = new Date().getTime();
  
    /*
     * This function picks up when a laptop cmes out of suspended state.
     * When that happens, close web socket and reconnect
     */
    setInterval(function () {
      var current = new Date().getTime();
      if (current - last > 3000) {
        log("power was un-suspended");
        conn.close();
      }
      last = current;
    }, 1000);
  
    /*
     * This function wakes up every 10 seconds and calls Dashboard.jsx to see if we are online.
     * Dashboard will reply via "onlineStatus" onmessage below
     */
    const checkConnection = () => {
      // if connection closed, then try reopen
      postMessage({
        msg: "isOnline",
      });
    };
  
    const log = (msg) => {
      let debugmode = true;
      if (debugmode)
        console.log("notificationworker: " + new Date().toString() + " " + msg);
    };
  
    onmessage = function (e) {
      const connect = (e) => {
        log("notificationworker: starting");
        connectE = e;
        // before opening, check we not already open
        if (conn && conn.readyState === 1) {
          log("notificationworker: close-to-start");
          conn.close();
          return;
        }
        if (conn) conn = null;
        conn = new WebSocket(e.data.url);
        conn.onopen = () => {
          log("notificationworker: opened! ");
          isOnLine = true;
          // start interval to check if we online
          if (!interval) interval = setInterval(checkConnection, 10000);
        };
        conn.onerror = (event) => {
          isOnLine = false;
          log("error! ", event);
          // start interval to try connect every 10 seconds
          //connectInterval = setInterval(tryConnect, 10000);
        };
        conn.onclose = function (evt) {
          log("onclose");
          conn = null;
          if (isOnLine) connect(e);
        };
        conn.onmessage = function (evt) {
          log("onmessage");
          postMessage({
            msg: "receivedNotifications",
            status: 200,
            notifications: JSON.parse(evt.data),
          });
        };
        log("started ");
        started = true;
      };
      // if starting the websocket connection
      if (e && e.data && e.data.msg === "start" && !started) {
        connect(e);
      }
  
      // Getting navigator.onLine status back from Dashboard.js, after checkConnection polled for online status
      // If we go from an offline to online status, then reconnect the websocket connection
      if (e && e.data && e.data.msg === "onlineStatus") {
        if (isOnLine && !e.data.online) {
          log("going offline");
          isOnLine = false;
          conn.close();
        }
  
        // if we are going from offline to online, then reconnect
        if (!isOnLine && e.data.online) {
          console.log("going online " + new Date().toString());
          isOnLine = true;
          // close the web socket connection, so above conn.onclose will kick in a minute later and reopen the connection
          conn = null;
          connect(connectE);
        }
        isOnLine = e.data.online;
      }
  
      // if passing in a new token
      if (e && e.data && e.data.msg === "token") {
        console.log("setting token ");
        token = e.data.token;
      }
    };
  };

  let code = workercode.toString();
  code = code.substring(code.indexOf("{") + 1, code.lastIndexOf("}"));
  
  const blob = new Blob([code], { type: "application/javascript" });
  const NotifWorker = URL.createObjectURL(blob);
  
  //module.exports = worker_script;
  export default NotifWorker;
