package com.example.alarm.service.mapper;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class AlarmMapperTest {

    private AlarmMapper alarmMapper;

    @BeforeEach
    public void setUp() {
        alarmMapper = new AlarmMapperImpl();
    }
}
