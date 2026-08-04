import { app } from '../../../scripts/app.js'

// ============================================================================
// VHS Settings i18n — Combined DOM override pattern (like LoRA Manager)
// Merged: VHS.settings.js + VHS.locale.js → single file
// ============================================================================

let vhsTranslations = { en: null, uk: null };

function getVHSLocale() {
    try {
        // 1. HIGHEST priority: app.ui.settings.getSettingValue('Comfy.Locale')
        const uiSettings = app?.ui?.settings;
        if (uiSettings && typeof uiSettings.getSettingValue === 'function') {
            const lang = uiSettings.getSettingValue('Comfy.Locale');
            if (lang === 'uk' || lang?.startsWith('uk')) return 'uk';
            if (lang === 'en') return 'en';
        }
        
        // 2. Fallback: app.extensionManager.setting.get('Comfy.Locale')
        const settingManager = app?.extensionManager?.setting;
        if (settingManager && typeof settingManager.get === 'function') {
            const lang = settingManager.get('Comfy.Locale');
            if (lang === 'uk' || lang?.startsWith('uk')) return 'uk';
            if (lang === 'en') return 'en';
        }
    } catch (e) { /* ignore */ }
    
    // 3. Last resort: browser language
    if (navigator.language && navigator.language.startsWith('uk')) return 'uk';
    return 'en';
}

function loadVHSTranslations() {
    try {
        // Load both English and Ukrainian translations
        const xhrEn = new XMLHttpRequest();
        xhrEn.open('GET', `/extensions/comfyui-videohelpersuite/locales/en/settings.json`, false);
        xhrEn.send(null);
        if (xhrEn.status === 200) {
            try {
                vhsTranslations.en = JSON.parse(xhrEn.responseText);
                console.log('[VHS] English translations loaded');
            } catch (e) {
                console.warn('[VHS] Failed to parse English translations JSON', e);
            }
        }
        
        const xhrUk = new XMLHttpRequest();
        xhrUk.open('GET', `/extensions/comfyui-videohelpersuite/locales/uk/settings.json`, false);
        xhrUk.send(null);
        if (xhrUk.status === 200) {
            try {
                vhsTranslations.uk = JSON.parse(xhrUk.responseText);
                console.log('[VHS] Ukrainian translations loaded');
            } catch (e) {
                console.warn('[VHS] Failed to parse Ukrainian translations JSON', e);
            }
        }
    } catch (e) {
        console.warn('[VHS] Failed to load translations', e);
    }
}

function vhsT(key, field) {
    const locale = getVHSLocale();
    
    // Try Ukrainian first, then English fallback
    for (const tryLocale of [locale, 'en']) {
        if (!vhsTranslations[tryLocale]) continue;
        
        const data = vhsTranslations[tryLocale][key];
        if (!data) continue;
        
        const parts = field.split('.');
        let value = data;
        for (const part of parts) {
            if (value && value[part] !== undefined) {
                value = value[part];
            } else {
                return null;
            }
        }
        
        // If we found a non-empty value, use it
        if (value && value !== '') return value;
    }
    
    return null;
}

// Load translations immediately (non-blocking)
loadVHSTranslations();

// ============================================================================
// VHS Settings definitions with i18n support (for getTranslatedSettings export)
// Used by VHS.core.js for the settings() getter
// ============================================================================

const VHS_SETTINGS = [
    {
        id: 'VHS.AdvancedPreviews',
        category: ['🎥🅥🅗🅢', 'Previews', 'Advanced Previews'],
        nameKey: 'VHS.AdvancedPreviews.name',
        tooltipKey: 'VHS.AdvancedPreviews.tooltip',
        type: 'combo',
        options: ['Never', 'Always', 'Input Only'],
        defaultValue: 'Input Only',
    },
    {
        id: 'VHS.AdvancedPreviewsMinWidth',
        category: ['🎥🅥🅗🅢', 'Previews', 'Min Width'],
        nameKey: 'VHS.AdvancedPreviewsMinWidth.name',
        tooltipKey: 'VHS.AdvancedPreviewsMinWidth.tooltip',
        type: 'number',
        attrs: {
            min: 0,
            step: 1,
            max: 3840,
        },
        defaultValue: 0,
    },
    {
        id: 'VHS.AdvancedPreviewsDeadline',
        category: ['🎥🅥🅗🅢', 'Previews', 'Deadline'],
        nameKey: 'VHS.AdvancedPreviewsDeadline.name',
        tooltipKey: 'VHS.AdvancedPreviewsDeadline.tooltip',
        type: 'combo',
        options: ['realtime', 'good'],
        defaultValue: 'realtime',
    },
    {
        id: 'VHS.AdvancedPreviewsDefaultMute',
        category: ['🎥🅥🅗🅢', 'Previews', 'Default Mute'],
        nameKey: 'VHS.AdvancedPreviewsDefaultMute.name',
        tooltipKey: 'VHS.AdvancedPreviewsDefaultMute.tooltip',
        type: 'boolean',
        defaultValue: false,
    },
    {
        id: 'VHS.LatentPreview',
        category: ['🎥🅥🅗🅢', 'Sampling', 'Latent Previews'],
        nameKey: 'VHS.LatentPreview.name',
        tooltipKey: 'VHS.LatentPreview.tooltip',
        type: 'boolean',
        defaultValue: false,
    },
    {
        id: "VHS.LatentPreviewRate",
        category: ['🎥🅥🅗🅢', 'Sampling', 'Latent Preview Rate'],
        nameKey: 'VHS.LatentPreviewRate.name',
        tooltipKey: 'VHS.LatentPreviewRate.tooltip',
        type: 'number',
        attrs: {
            min: 0,
            step: 1,
            max: 60
        },
        defaultValue: 0,
    },
    {
        id: 'VHS.MetadataImage',
        category: ['🎥🅥🅗🅢', 'Output', 'MetadataImage'],
        nameKey: 'VHS.MetadataImage.name',
        tooltipKey: 'VHS.MetadataImage.tooltip',
        type: 'boolean',
        defaultValue: true,
    },
    {
        id: 'VHS.KeepIntermediate',
        category: ['🎥🅥🅗🅢', 'Output', 'Keep Intermediate'],
        nameKey: 'VHS.KeepIntermediate.name',
        tooltipKey: 'VHS.KeepIntermediate.tooltip',
        type: 'boolean',
        defaultValue: true,
    },
];

const ENGLISH_NAMES = {
    'VHS.AdvancedPreviews': 'Advanced Previews',
    'VHS.AdvancedPreviewsMinWidth': 'Minimum preview width',
    'VHS.AdvancedPreviewsDeadline': 'Deadline',
    'VHS.AdvancedPreviewsDefaultMute': 'Mute videos by default',
    'VHS.LatentPreview': 'Display animated previews when sampling',
    'VHS.LatentPreviewRate': 'Playback rate override.',
    'VHS.MetadataImage': 'Save png of first frame for metadata',
    'VHS.KeepIntermediate': 'Keep required intermediate files after sucessful execution',
};

const ENGLISH_TOOLTIPS = {
    'VHS.AdvancedPreviews': 'Automatically transcode previews on request. Required for advanced functionality',
    'VHS.AdvancedPreviewsMinWidth': "Advanced previews have their resolution downscaled to the node size for performance. While a node can be resized to increase preview quality, a minimum width can be set that previews won't be downscaled beneath. Preveiws will never be upscaled, so this can safely be set large.",
    'VHS.AdvancedPreviewsDeadline': "Determines how much time can be spent when encoding advanced previews. Realtime results in reduced quality, but good will likely cause the preview to stutter as initial generation occurs",
    'VHS.LatentPreviewRate': "Force a specific frame rate for the playback of latent frames. This should not be confused with the output frame rate and will not match for video models.",
};

export function getTranslatedSettings() {
    const settings = [];
    
    for (const setting of VHS_SETTINGS) {
        const translatedSetting = { ...setting };
        
        // Replace nameKey with actual translated value or fallback to English
        if (setting.nameKey) {
            const keyId = setting.nameKey.replace('.name', '');
            const translatedName = vhsT(keyId, 'name');
            translatedSetting.name = translatedName || ENGLISH_NAMES[keyId] || setting.nameKey;
        }
        
        // Replace tooltipKey with actual translated value or fallback to English
        if (setting.tooltipKey) {
            const keyId = setting.tooltipKey.replace('.tooltip', '');
            const translatedTooltip = vhsT(keyId, 'tooltip');
            translatedSetting.tooltip = translatedTooltip || ENGLISH_TOOLTIPS[keyId] || setting.tooltipKey;
        }
        
        settings.push(translatedSetting);
    }
    
    return settings;
}

// ============================================================================
// DOM Override — Apply translations to existing settings elements (like LoRA Manager)
// This runs every 500ms via setInterval to catch dynamically rendered settings.
// Idempotency: each element is marked with data-vhs-translated="true" after
// translation; on subsequent passes we skip it unless the locale changed or
// the current text no longer matches what we expect (e.g. user switched lang).
// ============================================================================

let vhsLastLocale = null; // track last locale to detect switches

function overrideVHSSettings() {
    const settings = document.querySelectorAll('[data-setting-id^="VHS."]');
    
    // Option translation maps for combo-type settings
    const optionTranslationMaps = {
        "VHS.AdvancedPreviews": { 
            en: ["Never", "Always", "Input Only"],
            uk: ["Ніколи", "Завжди", "Тільки вхід"]
        },
        "VHS.AdvancedPreviewsDeadline": { 
            en: ["realtime", "good"],
            uk: ["realtime", "good"]
        }
    };

    settings.forEach(settingEl => {
        const settingId = settingEl.dataset.settingId;
        
        // --- Idempotency guard for setting elements ---
        // If already translated and locale hasn't changed, verify text still matches.
        if (settingEl.dataset.vhsTranslated === 'true') {
            // Locale switched — need to re-translate everything
            if (vhsLastLocale !== getVHSLocale()) {
                delete settingEl.dataset.vhsTranslated;
            } else {
                // Same locale, same text → skip this element entirely
                return;
            }
        }

        const currentLocale = getVHSLocale();
        
        // Get translated name and tooltip from JSON (respects current locale)
        let translatedName = vhsT(settingId, 'name');
        let translatedTooltip = vhsT(settingId, 'tooltip');
        
        // If locale is English, fall back to hardcoded English names/tooltips
        // so previously-applied Ukrainian text gets reverted to English.
        if (currentLocale === 'en') {
            translatedName = translatedName || ENGLISH_NAMES[settingId];
            translatedTooltip = translatedTooltip || ENGLISH_TOOLTIPS[settingId];
        }
        
        if (translatedName) {
            const nameEl = settingEl.querySelector('.setting-name, [class*="name"], .font-medium');
            if (nameEl && nameEl.textContent !== translatedName) {
                nameEl.textContent = translatedName;
            }
        }
        
        if (translatedTooltip) {
            const tooltipEl = settingEl.querySelector('.setting-tooltip, [class*="tooltip"], .text-muted-foreground');
            if (tooltipEl) tooltipEl.setAttribute('title', translatedTooltip);
            
            // Also try to find title attributes on parent elements
            const parentWithTooltip = settingEl.closest('[title]') || settingEl.parentElement?.closest('[title]');
            if (parentWithTooltip && !parentWithTooltip.classList.contains('setting-group')) {
                const currentTitle = parentWithTooltip.getAttribute('title');
                if (currentTitle !== translatedTooltip) {
                    parentWithTooltip.setAttribute('title', translatedTooltip);
                }
            }
        }
        
        // Translate option values for combo-type settings
        const optionMap = optionTranslationMaps[settingId];
        if (optionMap) {
            const translations = optionMap[currentLocale] || optionMap.en;
            
            // Find all <option> elements inside this setting's select
            const options = settingEl.querySelectorAll('select option');
            options.forEach((opt, index) => {
                if (translations[index]) {
                    opt.textContent = translations[index];
                }
            });
            
            // Also handle the currently displayed value in the select element itself
            const selectEl = settingEl.querySelector('select');
            if (selectEl && selectEl.value) {
                const selectedIndex = parseInt(selectEl.value);
                if (!isNaN(selectedIndex) && translations[selectedIndex]) {
                    const selectedOption = selectEl.querySelector(`option[value="${selectEl.value}"]`);
                    if (selectedOption) {
                        selectedOption.textContent = translations[selectedIndex];
                    }
                }
            }
        }
        
        // Mark as translated so next interval pass skips it
        settingEl.dataset.vhsTranslated = 'true';
    });
    
    // Translate category headers in Settings UI (also idempotent)
    translateCategoryHeaders();
}

// ============================================================================
// Category Headers Translation (simple overwrite per cycle, like LoRA Manager)
// Each interval pass: check current locale → replace textContent directly.
// No state markers — always re-check so language switching works both ways.
// Debounced: only writes when text actually differs to avoid flickering.
// ============================================================================

const CATEGORY_HEADERS = {
    'Previews': { en: 'Previews', uk: 'Попередні перегляди' },
    'Sampling': { en: 'Sampling', uk: 'Семплінг' },
    'Output': { en: 'Output', uk: 'Вихід' },
};

function translateCategoryHeaders() {
    const locale = getVHSLocale();
    
    // Find all setting group headers (category labels)
    const categoryElements = document.querySelectorAll('[class*="setting-group"], [class*="group-label"]');
    
    categoryElements.forEach(el => {
        const text = el.textContent?.trim();
        if (!text) return;
        
        for (const [english, translations] of Object.entries(CATEGORY_HEADERS)) {
            const targetText = translations[locale];
            
            // Check if current text matches English or Ukrainian version
            // (either exact match or as a suffix after emoji/prefix)
            const matchesEnglish = text === english || text.endsWith(english);
            const matchesUkrainian = text === translations.uk || text.endsWith(translations.uk);
            
            if (matchesEnglish || matchesUkrainian) {
                // Only write if text actually differs — prevents flickering
                if (text !== targetText && !text.endsWith(targetText)) {
                    // Preserve any prefix (e.g. emoji) and replace only the category word
                    const prefix = text.slice(0, text.length - (matchesEnglish ? english.length : translations.uk.length));
                    el.textContent = prefix + targetText;
                }
            }
        }
    });
}

// ============================================================================
// Locale Switch Detection — clear setting element markers when language changes
// Only needed for setting elements (not category headers, which are self-correcting)
// ============================================================================

function checkLocaleSwitch() {
    const currentLocale = getVHSLocale();
    
    if (vhsLastLocale !== null && vhsLastLocale !== currentLocale) {
        // Language changed — clear all markers so settings get re-translated
        console.log('[VHS] Locale switched from', vhsLastLocale, 'to', currentLocale);
        
        document.querySelectorAll('[data-vhs-translated="true"]').forEach(el => {
            delete el.dataset.vhsTranslated;
        });
    }
    
    vhsLastLocale = currentLocale;
}

// Start interval to override settings translations every 1s (reduced from 500ms to avoid flickering)
const vhsSettingsInterval = setInterval(() => {
    checkLocaleSwitch();
    overrideVHSSettings();
}, 1000);
