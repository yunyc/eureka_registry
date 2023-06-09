package com.example.alarm.service.impl;

import com.example.alarm.domain.Notice;
import com.example.alarm.domain.event.NoticeChanged;
import com.example.alarm.repository.NoticeRepository;
import com.example.alarm.service.NoticeService;
import com.example.alarm.web.rest.dto.AlarmDTO;
import com.example.alarm.web.rest.dto.NoticeDTO;
import com.example.alarm.web.rest.mapper.NoticeMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

/**
 * Service Implementation for managing {@link Notice}.
 */
@Service
@Transactional
public class NoticeServiceImpl implements NoticeService {

    private final Logger log = LoggerFactory.getLogger(NoticeServiceImpl.class);

    private final NoticeRepository noticeRepository;

    private final NoticeMapper noticeMapper;

    public NoticeServiceImpl(NoticeRepository noticeRepository, NoticeMapper noticeMapper) {
        this.noticeRepository = noticeRepository;
        this.noticeMapper = noticeMapper;
    }

    @Override
    public NoticeDTO save(NoticeDTO noticeDTO) {
        log.debug("Request to save Notice : {}", noticeDTO);
        Notice notice = noticeMapper.toEntity(noticeDTO);
        notice = noticeRepository.save(notice);
        return noticeMapper.toDto(notice);
    }

    @Override
    public NoticeDTO update(NoticeDTO noticeDTO) {
        log.debug("Request to update Notice : {}", noticeDTO);
        Notice notice = noticeMapper.toEntity(noticeDTO);
        notice = noticeRepository.save(notice);
        return noticeMapper.toDto(notice);
    }

    @Override
    public Optional<NoticeDTO> partialUpdate(NoticeDTO noticeDTO) {
        log.debug("Request to partially update Notice : {}", noticeDTO);

        return noticeRepository
            .findById(noticeDTO.getId())
            .map(existingNotice -> {
                noticeMapper.partialUpdate(existingNotice, noticeDTO);

                return existingNotice;
            })
            .map(noticeRepository::save)
            .map(noticeMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<NoticeDTO> findAll(Pageable pageable) {
        log.debug("Request to get all Notices");
        return noticeRepository.findAll(pageable).map(noticeMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<NoticeDTO> findOne(Long id) {
        log.debug("Request to get Notice : {}", id);
        return noticeRepository.findById(id).map(noticeMapper::toDto);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Notice : {}", id);
        noticeRepository.deleteById(id);
    }

    @Override
    public void processNoticeChanged(NoticeChanged noticeChanged) {
        NoticeDTO noticeDTO = new NoticeDTO();
        AlarmDTO alarmDTO = new AlarmDTO();
        alarmDTO.setId(noticeChanged.getAlarmId());
        noticeDTO.setAlarm(alarmDTO);
        noticeDTO.setContent(noticeChanged.getContent());
        noticeDTO.setSiteUrl(noticeChanged.getSiteUrl());
        noticeDTO.setCrawledDate(noticeChanged.getCrawledDate());
        save(noticeDTO);
        //save
    }
}
