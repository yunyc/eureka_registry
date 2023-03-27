package com.example.alarm.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.example.alarm.IntegrationTest;
import com.example.alarm.service.dto.KeywordDTO;
import com.example.alarm.service.mapper.KeywordMapper;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link KeywordResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class KeywordResourceIT {

    private static final String DEFAULT_TEXT = "AAAAAAAAAA";
    private static final String UPDATED_TEXT = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/keywords";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private KeywordRepository keywordRepository;

    @Autowired
    private KeywordMapper keywordMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restKeywordMockMvc;

    private Keyword keyword;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Keyword createEntity(EntityManager em) {
        Keyword keyword = new Keyword().text(DEFAULT_TEXT);
        return keyword;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Keyword createUpdatedEntity(EntityManager em) {
        Keyword keyword = new Keyword().text(UPDATED_TEXT);
        return keyword;
    }

    @BeforeEach
    public void initTest() {
        keyword = createEntity(em);
    }

    @Test
    @Transactional
    void createKeyword() throws Exception {
        int databaseSizeBeforeCreate = keywordRepository.findAll().size();
        // Create the Keyword
        KeywordDTO keywordDTO = keywordMapper.toDto(keyword);
        restKeywordMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(keywordDTO))
            )
            .andExpect(status().isCreated());

        // Validate the Keyword in the database
        List<Keyword> keywordList = keywordRepository.findAll();
        assertThat(keywordList).hasSize(databaseSizeBeforeCreate + 1);
        Keyword testKeyword = keywordList.get(keywordList.size() - 1);
        assertThat(testKeyword.getText()).isEqualTo(DEFAULT_TEXT);
    }

    @Test
    @Transactional
    void createKeywordWithExistingId() throws Exception {
        // Create the Keyword with an existing ID
        keyword.setId(1L);
        KeywordDTO keywordDTO = keywordMapper.toDto(keyword);

        int databaseSizeBeforeCreate = keywordRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restKeywordMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(keywordDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Keyword in the database
        List<Keyword> keywordList = keywordRepository.findAll();
        assertThat(keywordList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkTextIsRequired() throws Exception {
        int databaseSizeBeforeTest = keywordRepository.findAll().size();
        // set the field null
        keyword.setText(null);

        // Create the Keyword, which fails.
        KeywordDTO keywordDTO = keywordMapper.toDto(keyword);

        restKeywordMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(keywordDTO))
            )
            .andExpect(status().isBadRequest());

        List<Keyword> keywordList = keywordRepository.findAll();
        assertThat(keywordList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllKeywords() throws Exception {
        // Initialize the database
        keywordRepository.saveAndFlush(keyword);

        // Get all the keywordList
        restKeywordMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(keyword.getId().intValue())))
            .andExpect(jsonPath("$.[*].text").value(hasItem(DEFAULT_TEXT)));
    }

    @Test
    @Transactional
    void getKeyword() throws Exception {
        // Initialize the database
        keywordRepository.saveAndFlush(keyword);

        // Get the keyword
        restKeywordMockMvc
            .perform(get(ENTITY_API_URL_ID, keyword.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(keyword.getId().intValue()))
            .andExpect(jsonPath("$.text").value(DEFAULT_TEXT));
    }

    @Test
    @Transactional
    void getNonExistingKeyword() throws Exception {
        // Get the keyword
        restKeywordMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingKeyword() throws Exception {
        // Initialize the database
        keywordRepository.saveAndFlush(keyword);

        int databaseSizeBeforeUpdate = keywordRepository.findAll().size();

        // Update the keyword
        Keyword updatedKeyword = keywordRepository.findById(keyword.getId()).get();
        // Disconnect from session so that the updates on updatedKeyword are not directly saved in db
        em.detach(updatedKeyword);
        updatedKeyword.text(UPDATED_TEXT);
        KeywordDTO keywordDTO = keywordMapper.toDto(updatedKeyword);

        restKeywordMockMvc
            .perform(
                put(ENTITY_API_URL_ID, keywordDTO.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(keywordDTO))
            )
            .andExpect(status().isOk());

        // Validate the Keyword in the database
        List<Keyword> keywordList = keywordRepository.findAll();
        assertThat(keywordList).hasSize(databaseSizeBeforeUpdate);
        Keyword testKeyword = keywordList.get(keywordList.size() - 1);
        assertThat(testKeyword.getText()).isEqualTo(UPDATED_TEXT);
    }

    @Test
    @Transactional
    void putNonExistingKeyword() throws Exception {
        int databaseSizeBeforeUpdate = keywordRepository.findAll().size();
        keyword.setId(count.incrementAndGet());

        // Create the Keyword
        KeywordDTO keywordDTO = keywordMapper.toDto(keyword);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restKeywordMockMvc
            .perform(
                put(ENTITY_API_URL_ID, keywordDTO.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(keywordDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Keyword in the database
        List<Keyword> keywordList = keywordRepository.findAll();
        assertThat(keywordList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchKeyword() throws Exception {
        int databaseSizeBeforeUpdate = keywordRepository.findAll().size();
        keyword.setId(count.incrementAndGet());

        // Create the Keyword
        KeywordDTO keywordDTO = keywordMapper.toDto(keyword);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restKeywordMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(keywordDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Keyword in the database
        List<Keyword> keywordList = keywordRepository.findAll();
        assertThat(keywordList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamKeyword() throws Exception {
        int databaseSizeBeforeUpdate = keywordRepository.findAll().size();
        keyword.setId(count.incrementAndGet());

        // Create the Keyword
        KeywordDTO keywordDTO = keywordMapper.toDto(keyword);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restKeywordMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(keywordDTO))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Keyword in the database
        List<Keyword> keywordList = keywordRepository.findAll();
        assertThat(keywordList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateKeywordWithPatch() throws Exception {
        // Initialize the database
        keywordRepository.saveAndFlush(keyword);

        int databaseSizeBeforeUpdate = keywordRepository.findAll().size();

        // Update the keyword using partial update
        Keyword partialUpdatedKeyword = new Keyword();
        partialUpdatedKeyword.setId(keyword.getId());

        restKeywordMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedKeyword.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedKeyword))
            )
            .andExpect(status().isOk());

        // Validate the Keyword in the database
        List<Keyword> keywordList = keywordRepository.findAll();
        assertThat(keywordList).hasSize(databaseSizeBeforeUpdate);
        Keyword testKeyword = keywordList.get(keywordList.size() - 1);
        assertThat(testKeyword.getText()).isEqualTo(DEFAULT_TEXT);
    }

    @Test
    @Transactional
    void fullUpdateKeywordWithPatch() throws Exception {
        // Initialize the database
        keywordRepository.saveAndFlush(keyword);

        int databaseSizeBeforeUpdate = keywordRepository.findAll().size();

        // Update the keyword using partial update
        Keyword partialUpdatedKeyword = new Keyword();
        partialUpdatedKeyword.setId(keyword.getId());

        partialUpdatedKeyword.text(UPDATED_TEXT);

        restKeywordMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedKeyword.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedKeyword))
            )
            .andExpect(status().isOk());

        // Validate the Keyword in the database
        List<Keyword> keywordList = keywordRepository.findAll();
        assertThat(keywordList).hasSize(databaseSizeBeforeUpdate);
        Keyword testKeyword = keywordList.get(keywordList.size() - 1);
        assertThat(testKeyword.getText()).isEqualTo(UPDATED_TEXT);
    }

    @Test
    @Transactional
    void patchNonExistingKeyword() throws Exception {
        int databaseSizeBeforeUpdate = keywordRepository.findAll().size();
        keyword.setId(count.incrementAndGet());

        // Create the Keyword
        KeywordDTO keywordDTO = keywordMapper.toDto(keyword);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restKeywordMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, keywordDTO.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(keywordDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Keyword in the database
        List<Keyword> keywordList = keywordRepository.findAll();
        assertThat(keywordList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchKeyword() throws Exception {
        int databaseSizeBeforeUpdate = keywordRepository.findAll().size();
        keyword.setId(count.incrementAndGet());

        // Create the Keyword
        KeywordDTO keywordDTO = keywordMapper.toDto(keyword);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restKeywordMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(keywordDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Keyword in the database
        List<Keyword> keywordList = keywordRepository.findAll();
        assertThat(keywordList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamKeyword() throws Exception {
        int databaseSizeBeforeUpdate = keywordRepository.findAll().size();
        keyword.setId(count.incrementAndGet());

        // Create the Keyword
        KeywordDTO keywordDTO = keywordMapper.toDto(keyword);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restKeywordMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(keywordDTO))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Keyword in the database
        List<Keyword> keywordList = keywordRepository.findAll();
        assertThat(keywordList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteKeyword() throws Exception {
        // Initialize the database
        keywordRepository.saveAndFlush(keyword);

        int databaseSizeBeforeDelete = keywordRepository.findAll().size();

        // Delete the keyword
        restKeywordMockMvc
            .perform(delete(ENTITY_API_URL_ID, keyword.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Keyword> keywordList = keywordRepository.findAll();
        assertThat(keywordList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
