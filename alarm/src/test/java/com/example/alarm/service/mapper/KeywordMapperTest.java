package com.example.alarm.service.mapper;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class KeywordMapperTest {

    private KeywordMapper keywordMapper;

    @BeforeEach
    public void setUp() {
        keywordMapper = new KeywordMapperImpl();
    }
}
