import { OnInit } from '@angular/core';
import { NotificationService } from 'platform-commons';
export declare class ProjectNotificationComponent implements OnInit {
    _notificationService: NotificationService;
    constructor(_notificationService: NotificationService);
    ngOnInit(): void;
}
