/*
*
*  Push Notifications codelab
*  Copyright 2015 Google Inc. All rights reserved.
*
*  Licensed under the Apache License, Version 2.0 (the "License");
*  you may not use this file except in compliance with the License.
*  You may obtain a copy of the License at
*
*      https://www.apache.org/licenses/LICENSE-2.0
*
*  Unless required by applicable law or agreed to in writing, software
*  distributed under the License is distributed on an "AS IS" BASIS,
*  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
*  See the License for the specific language governing permissions and
*  limitations under the License
*
*/

/* eslint-env browser, es6 */

'use strict';

var pushButton = document.querySelector('.js-push-btn');
var isSubscribed = false;
var swRegistration = null;

// #8
function updateSubscriptionOnServer(subscription) {
  // TODO: Send subscription to application server

  const subscriptionJson = document.querySelector('.js-subscription-json');
  const subscriptionDetails =
    document.querySelector('.js-subscription-details');

  if (subscription) {
    subscriptionJson.textContent = JSON.stringify(subscription);
    subscriptionDetails.classList.remove('is-invisible');
  } else {
    subscriptionDetails.classList.add('is-invisible');
  }
}

// #7
function subscribeUser() {
  swRegistration.pushManager.subscribe({
    // 푸시 수신 시 알람 표시 속성
    userVisibleOnly: true
  })
  .then(function(subscription) {
    console.log('User is subscribed:', subscription);

    updateSubscriptionOnServer(subscription);

    isSubscribed = true;

    updateBtn();
  })
  .catch(function(err) {
    console.log('Failed to subscribe the user: ', err);
    updateBtn();
  });
}

// #4
function initialiseUI() {
  // #5
  pushButton.addEventListener('click', function() {
    pushButton.disabled = true;
    if (isSubscribed) {
      // TODO: Unsubscribe user
    } else {
      subscribeUser();
    }
  });

  // Set the initial subscription value
  swRegistration.pushManager.getSubscription()
  .then(function(subscription) {
    isSubscribed = !(subscription === null);

    // #6
    updateSubscriptionOnServer(subscription);
    //

    if (isSubscribed) {
      console.log('User IS subscribed.');
    } else {
      console.log('User is NOT subscribed.');
    }

    updateBtn();
  });
}

// #3
function updateBtn() {
  // #9
  if (Notification.permission === 'denied') {
    pushButton.textContent = 'Push Messaging Blocked.';
    pushButton.disabled = true;
    updateSubscriptionOnServer(null);
    return;
  }
  //

  if (isSubscribed) {
    pushButton.textContent = 'Disable Push Messaging';
  } else {
    pushButton.textContent = 'Enable Push Messaging';
  }

  pushButton.disabled = false;
}

// #2
function getKey() {
  navigator.serviceWorker.ready.then(function(reg) {
    reg.pushManager.subscribe({userVisibleOnly: true}).then(function(subscription) {
        // isPushEnabled = true;
        // updatePushSwitch();

        // Update status to subscribe current user on server, and to let
        // other users know this user has subscribed
        var endpoint = subscription.endpoint;
        var key = subscription.getKey('p256dh');

        console.log("browser key : ", key);
        // updateStatus(endpoint, key, 'subscribe');

      }).catch(function(e) {
        if (Notification.permission === 'denied') {
          // 사용자가 알람 권한을 설정하지 않은 경우
          console.log('알람 표시 설정이 되어 있지 않습니다.');
          // pushStatus.innerHTML = "알림 표시 설정이 필요합니다.";
        } else {
          // subscription 관련한 에러 발생시,
          // gcm_sender_id 또는 gcm_user_visible_only 를 확인
          console.log('Unable to subscribe to push.', e);
          // pushStatus.innerHTML = "알림 구독이 실패하였습니다.";
        }
      });
  });
}

// #1
if ('serviceWorker' in navigator && 'PushManager' in window) {
  console.log('Service Worker and Push is supported');

  navigator.serviceWorker.register('sw.js')
  .then(function(swReg) {
    console.log('Service Worker is registered', swReg);

    swRegistration = swReg;
    initialiseUI();
  })
  .catch(function(error) {
    console.error('Service Worker Error', error);
  });
} else {
  console.warn('Push messaging is not supported');
  pushButton.textContent = 'Push Not Supported';
}
