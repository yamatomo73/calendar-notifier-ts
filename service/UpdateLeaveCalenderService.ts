
/**
 * 退勤カレンダーイベント更新サービス
 * 
 * 使われ方のイメージ
 * 　- カレンダーには '退勤予定' という定期イベントが入っている
 *   - `updateScheduledToLeave` を呼び出すと指定した日の '退勤予定' をみつけて、
 *     そのイベントの時の開始時間を9時間後変更する
 */
class UpdateLeaveCalenderService {

    private calendar: GoogleAppsScript.Calendar.Calendar;

    /**
     * コンストラクタ
     * @param calendar
     */
    constructor(calendar: GoogleAppsScript.Calendar.Calendar) {
        this.calendar = calendar;
    }

    /**
     * 指定した日時を元に退勤予定時間を設定する
     * @params {Date} time
     */
    public updateScheduledToLeave(time: Date): void {
        // 9時間後
        const startTime: Date = new Date(time.getTime() + (60 * 60 * 9 * 1000));
        const endTime: Date = new Date(Utilities.formatDate(time, 'JST', 'yyyy/MM/dd 23:59:59'));

        const events: GoogleAppsScript.Calendar.CalendarEvent[] = this.calendar.getEventsForDay(time);
        events.forEach(function (event: GoogleAppsScript.Calendar.CalendarEvent): void {
            if ('退勤予定' === event.getTitle()) {
                event.setTitle('退勤');
                event.setTime(startTime, endTime);
            }
        });
    }
}