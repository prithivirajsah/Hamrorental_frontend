import { useEffect } from 'react';

export default function LiveChatWidget() {
  useEffect(() => {
    window.__lc = window.__lc || {};
    window.__lc.license = 19632904;
    window.__lc.integration_name = 'manual_onboarding';
    window.__lc.product_name = 'livechat';

    if (window.LiveChatWidget?.init) {
      return;
    }

    (function loadLiveChat(n, t, c) {
      function queueCall(args) {
        if (widget._h) {
          widget._h.apply(null, args);
        } else {
          widget._q.push(args);
        }
      }

      const widget = {
        _q: [],
        _h: null,
        _v: '2.0',
        on() {
          queueCall(['on', c.call(arguments)]);
        },
        once() {
          queueCall(['once', c.call(arguments)]);
        },
        off() {
          queueCall(['off', c.call(arguments)]);
        },
        get() {
          if (!widget._h) {
            throw new Error("[LiveChatWidget] You can't use getters before load.");
          }
          return queueCall(['get', c.call(arguments)]);
        },
        call() {
          queueCall(['call', c.call(arguments)]);
        },
        init() {
          const script = t.createElement('script');
          script.async = true;
          script.type = 'text/javascript';
          script.src = 'https://cdn.livechatinc.com/tracking.js';
          script.setAttribute('data-livechat-script', 'true');
          t.head.appendChild(script);
        },
      };

      if (!n.__lc.asyncInit) {
        widget.init();
      }

      n.LiveChatWidget = n.LiveChatWidget || widget;
    })(window, document, [].slice);
  }, []);

  return (
    <noscript>
      <a href="https://www.livechat.com/chat-with/19632904/" rel="nofollow">
        Chat with us
      </a>
      , powered by{' '}
      <a href="https://www.livechat.com/?welcome" rel="noopener nofollow" target="_blank">
        LiveChat
      </a>
    </noscript>
  );
}
