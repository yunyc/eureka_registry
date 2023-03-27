package com.example.alarm.domain.event;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
public class NoticeChanged {
    private String content;
    private String siteUrl;
    private LocalDate crawledDate;
    private Long alarmId;
}
