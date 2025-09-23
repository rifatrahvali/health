# GutWell Onboarding Flow Documentation

## Overview
This document details the complete onboarding flow for the GutWell gut health tracking application. The flow is designed with a value-first approach: show value, build trust, then request commitment.

## Core Principles
- **Progressive Disclosure**: Information is collected gradually to avoid overwhelming users
- **Value Demonstration**: Show personalized insights before asking for payment
- **Trust Building**: Transparent data usage and privacy explanations
- **Flexibility**: Skip options for non-essential steps
- **Localization**: Full Turkish/English language support

## Onboarding Phases

### Phase 1: Welcome & Goal Setting (Pre-Onboarding)
**Purpose**: Welcome users and understand their primary motivations

#### Step 1.1: Welcome Screen
- **Content**:
  - App logo animation
  - Tagline: "Mutlu bir bağırsak için daha iyi bir sen"
  - Value proposition statement
  - Language selector (TR/EN)
- **Actions**:
  - Select language
  - Tap "Yolculuğunuza Başlayın!" to continue
- **Duration**: 5-10 seconds

#### Step 1.2: App Permissions
- **Content**:
  - Notification permission request
    - Reason: "Kişiselleştirilmiş hatırlatıcılar için"
  - Health app integration (optional)
    - Apple Health/Google Fit sync
    - "Şimdilik Atla" option available
- **Actions**:
  - Allow/Deny permissions
  - Skip health integration if desired
- **Duration**: 20-30 seconds

#### Step 1.3: Goal Selection
- **Content**:
  - Question: "Uygulamamızdan ne elde etmek istiyorsunuz?"
  - Multiple choice options (can select multiple):
    - Daha az şişkinlik ve rahatsızlık
    - Daha düzenli sindirim
    - Daha fazla enerji ve zindelik
    - Genel bağırsak sağlığını iyileştirmek
    - Belirli bir durumu yönetmek (IBS, IBD, vb.)
    - Sağlıklı beslenme alışkanlıkları kazanmak
  - Importance scale (1-5 stars)
- **Actions**:
  - Select one or more goals
  - Rate importance
- **Duration**: 30-45 seconds
- **Progress Indicator**: 15% complete

### Phase 2: Comprehensive Health & Personal Data Collection
**Purpose**: Gather detailed information for personalization

#### Step 2.1: Demographics
- **Content**:
  - Age input
  - Biological sex selection
  - Height and weight
  - Location/timezone
  - BMI auto-calculation with healthy range display
- **Privacy Notice**: "Verileriniz güvende ve gizli"
- **Duration**: 45-60 seconds
- **Progress Indicator**: 25% complete

#### Step 2.2: Lifestyle & Dietary Habits
- **Content**:
  - Dietary patterns (multi-select with icons):
    - Vegan, Vejetaryen, Keto, Akdeniz
    - Omnivor, Glutensiz, Laktozsuz
    - Düşük FODMAP
  - Exercise frequency:
    - Hiç / Haftada 1-2 / Haftada 3-4 / Her gün
  - Sleep duration and quality
  - Stress level (1-5 scale with emojis)
  - Alcohol consumption
  - Smoking status
  - Daily water intake (visual counter)
- **Duration**: 60-90 seconds
- **Progress Indicator**: 40% complete

#### Step 2.3: Gut Health Symptoms
- **Content**:
  - Symptom checklist with severity ratings:
    - Şişkinlik, Gaz, Karın ağrısı
    - Kabızlık, İshal, Reflü
    - Yemek sonrası ağırlık
    - Yorgunluk, Beyin sisi
    - Cilt sorunları, Ruh hali değişimleri
  - Bristol Stool Scale (visual guide)
  - Frequency selection for each symptom
  - Quality of life impact (1-5)
- **Duration**: 90-120 seconds
- **Progress Indicator**: 55% complete

#### Step 2.4: Medical History
- **Content**:
  - Diagnosed conditions checklist:
    - IBS, IBD, Crohn, Ülseratif Kolit
    - Çölyak, SIBO, GÖRH, H. Pylori
  - Current medications (autocomplete)
  - Recent antibiotic use:
    - Son 3 ay / Son 1 yıl / 1 yıldan fazla / Hiç
- **Duration**: 45-60 seconds
- **Progress Indicator**: 70% complete

#### Step 2.5: Additional Information
- **Content**:
  - Food allergies/sensitivities
  - Foods to avoid
  - Primary concerns (guided selection)
  - Additional expectations (optional text)
- **Skip Option**: Available
- **Duration**: 30-45 seconds
- **Progress Indicator**: 85% complete

### Phase 3: Analysis & Personalized Preview
**Purpose**: Show immediate value through personalized insights

#### Step 3.1: Data Analysis Screen
- **Content**:
  - Loading animation
  - Progressive messages:
    - "Verileriniz analiz ediliyor..."
    - "Binlerce veri noktasıyla karşılaştırılıyor"
    - "Size özel planınız hazırlanıyor"
    - "Bağırsak sağlığı puanınız hesaplanıyor"
- **Duration**: 5-10 seconds (skippable after 3 seconds)
- **Progress Indicator**: 90% complete

#### Step 3.2: Personalized Report
- **Content**:
  - Greeting: "İşte Bağırsak Sağlığı Analiziniz, [Name]!"
  - Visual Gut Score (0-100)
    - Color-coded interpretation
    - "İyileştirme Potansiyeli: Yüksek"
  - Top 3 Key Findings:
    - Problem areas with icons
    - Potential triggers identified
    - Improvement opportunities
  - Quick Wins Preview:
    - "Bugün deneyebileceğiniz 3 basit değişiklik"
  - 30-60-90 Day Roadmap preview
  - Similar profile success story
- **Duration**: User-controlled (typically 60-90 seconds)
- **Progress Indicator**: 95% complete

### Phase 4: Commitment & Pledge
**Purpose**: Create psychological commitment and increase engagement through personal pledge

#### Step 4.1: Commitment Screen
- **Content**:
  - Headline: "Sağlığınıza Söz Verin" / "Make a Commitment to Your Health"
  - Personal pledge text:
    - TR: "Bağırsak sağlığımı iyileştirmek için her gün küçük adımlar atacağıma söz veriyorum."
    - EN: "I commit to taking small steps every day to improve my gut health."
  - Commitment methods (user chooses one):
    1. **Digital Signature**: Draw signature with finger
    2. **Name Entry**: Type full name as commitment
    3. **Long Press**: Hold button for 3 seconds to confirm
    4. **Voice Pledge**: Record a short voice commitment (optional)
  - Motivational quote displayed after commitment
  - "Bu yolculukta yalnız değilsiniz" / "You're not alone in this journey"
- **Interaction Types**:
  - Signature pad with clear/redo options
  - Text field for name entry with validation
  - Animated long-press button with progress indicator
  - Voice recording with playback option
- **Visual Feedback**:
  - Confetti animation on commitment
  - Checkmark animation
  - Personalized certificate preview
- **Duration**: 30-60 seconds
- **Progress Indicator**: 85% complete

### Phase 5: Subscription Offer
**Purpose**: Convert engaged users to paid subscription

#### Step 5.1: Value Proposition
- **Content**:
  - Headline: "Kişisel Bağırsak Sağlığı Koçunuz Hazır!"
  - Before/After scenario visualization
  - Premium benefits list:
    - ✓ Tamamen kişiselleştirilmiş 90 günlük plan
    - ✓ 1000+ gut-friendly tarif
    - ✓ Gelişmiş semptom analizi
    - ✓ Haftalık ilerleme raporları
    - ✓ Uzman diyetisyen danışmanlığı
    - ✓ Özel topluluk erişimi
- **Pricing Display**:
  - Monthly: ₺149/ay
  - Annual: ₺1190/yıl (33% tasarruf)
  - **7 Günlük Ücretsiz Deneme** (prominent)
- **Trust Indicators**:
  - "30 gün para iade garantisi"
  - "İstediğiniz zaman iptal"
  - "SSL güvenli ödeme"
- **Secondary Option**: "Ücretsiz sürümle devam"
- **Duration**: User-controlled

### Phase 6: Account Creation
**Purpose**: Secure user data and enable cross-device sync
**Note**: Only shown after subscription/trial selection

#### Step 6.1: Account Setup
- **Content**:
  - Headline: "Son Adım: Verilerinizi Güvenceye Alın"
  - Social login options (prioritized):
    - Apple ile Devam Et
    - Google ile Devam Et
    - Facebook ile Devam Et
  - Email/Password option (below social)
  - Terms & Privacy checkbox
  - "Tüm bilgileriniz kaydedildi" indicator
- **Duration**: 30-45 seconds

#### Step 6.2: Email Verification
- **Content**:
  - Non-blocking verification request
  - "E-postanızı doğrulayın ve bonus içeriklere erişin"
  - Continue using app with reminder badge
  - Resend option with cooldown
- **Duration**: Optional

### Phase 7: First Use & Quick Wins
**Purpose**: Ensure immediate engagement and value delivery

#### Step 7.1: Dashboard Tour
- **Content**:
  - Welcome message: "Hoş Geldiniz! İşte Kişisel Paneliniz"
  - Interactive tooltips showing:
    - Gut score location
    - Quick logging buttons
    - Today's recommendations
    - Progress tracking
  - First action prompts:
    - "İlk yemeğinizi kaydedin ve 10 puan kazanın!"
    - "Bugünkü su hedefinizi tamamlayın"
- **Quick Win Checklist**:
  - Log first meal
  - Complete water goal
  - Read daily tip
  - Set first reminder
- **Duration**: 60-90 seconds
- **Progress Indicator**: 100% complete ✅

## Technical Implementation

### Navigation Flow
```
Welcome → Permissions → Goals → Demographics → Lifestyle →
Symptoms → Medical → Additional → Analysis → Report →
Subscription → Account → Dashboard
```

### Skip Logic
- **Required Steps**: Welcome, Goals, Basic Demographics, Core Symptoms
- **Optional Steps**: Permissions, Additional Info, Account (if free tier)
- **Conditional Steps**: Medical History (shown if conditions selected)

### Data Persistence
- Save progress after each step
- Allow returning to previous steps
- Resume from last incomplete step if app closed

### Error Handling
- Validate inputs before progression
- Show inline error messages
- Allow correction without data loss

## Analytics Events

### Key Tracking Points
1. **Onboarding Started**: Language selected
2. **Permissions Granted/Denied**: Each permission status
3. **Goals Selected**: Which goals and importance
4. **Demographics Completed**: Basic user profile
5. **Symptoms Reported**: Severity and frequency
6. **Analysis Viewed**: Time spent on report
7. **Subscription Selected**: Plan chosen or skipped
8. **Account Created**: Method used
9. **Onboarding Completed**: Total time and completion rate

### Conversion Metrics
- **Step Completion Rate**: % completing each step
- **Drop-off Points**: Where users abandon
- **Time per Step**: Average duration
- **Skip Usage**: Which optional steps are skipped
- **Subscription Conversion**: % selecting paid plans
- **Trial Start Rate**: % starting free trial

## A/B Testing Opportunities

### Testable Elements
1. **Welcome Message**: Different value propositions
2. **Goal Options**: Number and phrasing of goals
3. **Question Order**: Symptoms before/after lifestyle
4. **Gut Score Presentation**: Numeric vs visual only
5. **Subscription Timing**: Before/after report
6. **Pricing Display**: Monthly vs annual emphasis
7. **Trial Duration**: 7 vs 14 days
8. **Social Proof**: Success stories placement

## Localization Considerations

### Turkish-Specific Features
- Local food database integration
- Regional symptom terminology
- Cultural meal timing (kahvaltı, öğle, akşam, ara öğün)
- KVKK compliance messaging
- Local payment methods
- Turkish healthcare provider directory

### Language Switching
- Persistent language preference
- Real-time UI updates
- Translated educational content
- Bilingual support team routing

## Accessibility Features

### WCAG 2.1 AA Compliance
- High contrast mode support
- Screen reader compatibility
- Voice input for text fields
- Large touch targets (44x44 minimum)
- Clear focus indicators
- Alternative text for images

### Cognitive Accessibility
- Simple language options
- Progress indicators
- Clear navigation
- Undo functionality
- No time limits (except verification)

## Success Metrics

### Target KPIs
- **Completion Rate**: >70% of started onboardings
- **Average Duration**: <8 minutes total
- **Subscription Conversion**: >25% to paid plans
- **Trial Conversion**: >40% trial to paid
- **User Satisfaction**: >4.5/5 rating
- **Data Quality**: >90% profile completeness

### Optimization Goals
- Reduce drop-off at each step by 10%
- Increase goal selection to 3+ per user
- Improve symptom reporting accuracy
- Boost health app integration to >60%
- Achieve <2% error rate in data entry

## Future Enhancements

### Version 2.0 Considerations
1. **AI-Powered Personalization**: Dynamic question flow based on responses
2. **Voice-Guided Onboarding**: Audio instructions option
3. **Video Tutorials**: Embedded how-to content
4. **Gamification**: Points and achievements during onboarding
5. **Social Features**: Connect with similar profiles
6. **Provider Integration**: Import medical records
7. **Microbiome Test**: Integration with test kit results
8. **Family Accounts**: Multi-profile setup

## Support Documentation

### Help Resources
- In-app chat support during onboarding
- FAQ for common questions
- Video walkthrough availability
- Email support fallback
- Community forum access

### Error Recovery
- Save and resume functionality
- Data recovery options
- Support ticket creation
- Direct support escalation paths