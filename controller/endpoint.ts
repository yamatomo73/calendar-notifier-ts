/**
 * ■このプロジェクト
 *  Google カレンダーのイベントをChatworkに通知する
 *
 * ■依存ライブラリ
 *  TBD
 *　
 * ■動作に必要なスクリプトプロパティ
 *
 * CALENDAR_ID: 対象のカレンダーID
 * NOTIFIER_CW_API_TOKEN: イベント情報を通知するChatworkアカウントのAPIトークン
 * NOTIFIER_CW_LOGIN_EMAIL: イベント情報を通知するChatworkアカウントのログインメールアドレス
 * NOTIFIER_CW_LOGIN_PASS: イベント情報を通知するChatworkアカウントのパスワード 
 * NOTIFY_ROOM_ID: イベント情報を通知するチャットルームID
 */

function doGet(e: any) {
  switch (e.parameter.mode) {
    case 'today':
      return notify_today();
  }
}

/**
 * 今日の予定をChatworkに通知する
 */
function notify_today(): void {
  const service: CalenderNotifierService = new CalenderNotifierService(getCalendar(), _getChatworkClient());
  service.notify_today();
}

/**
 * 対象のカレンダーオブジェクトを取得する
 */
function getCalendar(): GoogleAppsScript.Calendar.Calendar {
  return CalendarApp.getCalendarById(PropertiesService.getScriptProperties().getProperty('CALENDAR_ID'));
};

/*
 * chatwork クライアントと取得する
 */
function _getChatworkClient() {
  var notifier_chatwork_api_token = PropertiesService.getScriptProperties().getProperty('NOTIFIER_CW_API_TOKEN');
  var notifier_chatwork_email = PropertiesService.getScriptProperties().getProperty('NOTIFIER_CW_LOGIN_EMAIL');
  var notifier_chatwork_password = PropertiesService.getScriptProperties().getProperty('NOTIFIER_CW_LOGIN_PASS');
  return new ChatWorkClientEx.factory({
    'token': notifier_chatwork_api_token,
    'email': notifier_chatwork_email,
    'password': notifier_chatwork_password,
  });
}

function test_calendar_event_list() {
  var calendar = getCalendar();
  var events = calendar.getEvents(new Date('2018/12/17 00:00:00'), new Date('2018/12/18 00:00:00'));

  events.forEach(function (event, index) {
    // event = calender.getEventById(iCalId);
    Logger.log(event.getTitle());
  });

  //getMyEvents(CalendarApp.getCalendarById(PropertiesService.getScriptProperties().getProperty('CALENDAR_ID')).getEventsForDay(new Date())[0]);
}

