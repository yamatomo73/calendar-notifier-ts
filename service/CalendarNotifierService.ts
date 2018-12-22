
/**
 * カレンダー通知サービス
 */
class CalenderNotifierService {

    /**
     * Chatwork API クライアント
     */
    private chatwork_client: Object;
    private notify_room_id: number;

    /**
     * Chatworkに通知するカレンダー
     */
    private calendar: GoogleAppsScript.Calendar.Calendar;

    /**
     * コンストラクタ
     * @param chatwork_client 
     */
    constructor(calendar: GoogleAppsScript.Calendar.Calendar, chatwork_client: Object, notify_room_id: number) {
        this.calendar = calendar;
        this.chatwork_client = chatwork_client;
        this.notify_room_id = notify_room_id;
    }

    /**
     * 今日の予定をChatworkに通知する
     */
    public notify_today(): void {
        const now: Date = new Date();
        //const today: Date = new Date(Utilities.formatDate(now, 'JST', 'yyyy/MM/dd 00:00:00'));
        const today: Date = new Date('2018/12/13 00:00:00');
        const tomorrow: Date = new Date(today.getTime() + 60 * 60 * 24 * 1000);
        // Logger.log(Utilities.formatDate(today, "JST", "yyyy/MM/dd (E) HH:mm:ss Z"));
        // Logger.log(Utilities.formatDate(tomorrow, "JST", "yyyy/MM/dd (E) HH:mm:ss Z"));

        const events: GoogleAppsScript.Calendar.CalendarEvent[] = this.calendar.getEvents(today, tomorrow);
        const message: string = this.createPostMessage(events);

        if (message) {
            this.chatwork_client.sendMessage(
                {
                    'self_unread': 1,
                    'room_id': this.notify_room_id,
                    'body': Utilities.formatString('(*) 本日のイベント\n%s', message),
                }
            );
        }

        // 退勤予定をカレンダーにいれる
        this.updateScheduledToLeave(new Date());
    }

    /**
     * 指定した日時を元に退勤予定時間を設定する
     * @params {Date} time
     */
    private updateScheduledToLeave(time: Date): void {
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

    /**
     * Chatworkに投稿するメッセージ本文を生成する
     */
    private createPostMessage(events: GoogleAppsScript.Calendar.CalendarEvent[]): string {
        let message: string = '';
        events.forEach(function (event: GoogleAppsScript.Calendar.CalendarEvent, index: number) {
            // 終日イベント以外
            if (!event.isAllDayEvent()) {
                // ステータスをみて、参加するイベント
                const status: GoogleAppsScript.Calendar.GuestStatus = event.getMyStatus();
                Logger.log(event.getTitle() + ' ' + status);
                if (status != CalendarApp.GuestStatus.NO) {
                    message += Utilities.formatString("%s - %s %s\n", Utilities.formatDate(event.getStartTime(), 'JST', 'HH:mm'), Utilities.formatDate(event.getEndTime(), 'JST', 'HH:mm'), event.getTitle());
                }
            }
        });

        //Logger.log(message);
        return message;
    }
}