package com.example.alarm.domain.event;

import com.example.alarm.domain.enumeration.SelectedTime;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class AlarmChanged {
    private Long AlarmId;
    private String eventType;
    private String keyword;
    private List<String> excludeUrl = new ArrayList<>();
    private String siteUrl;
    private String description;
    private SelectedTime refeshTime;
    private String musicTitle;
    private String musicPath;
    private Boolean vbEnabled;
    private Boolean useSwitch;

    public AlarmChanged() {}
}
