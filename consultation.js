/* ============================================
   CONSULTATION PAGE — Form Logic & Google Forms Integration
   ============================================

   ╔══════════════════════════════════════════════════════════╗
   ║  GOOGLE FORMS INTEGRATION — SETUP INSTRUCTIONS          ║
   ╠══════════════════════════════════════════════════════════╣
   ║                                                          ║
   ║  To connect this form to your Google Form, follow        ║
   ║  these steps:                                            ║
   ║                                                          ║
   ║  1. CREATE YOUR GOOGLE FORM                              ║
   ║     - Go to https://forms.google.com                     ║
   ║     - Create a new form with these 9 questions:          ║
   ║       Q1: Gender (Multiple choice)                       ║
   ║       Q2: Age (Short answer)                             ║
   ║       Q3: Height (Short answer)                          ║
   ║       Q4: Weight (Short answer)                          ║
   ║       Q5: Fitness Goal (Multiple choice)                 ║
   ║       Q6: Workout Frequency (Multiple choice)            ║
   ║       Q7: Session Duration (Multiple choice)             ║
   ║       Q8: Exercise Location (Multiple choice)            ║
   ║       Q9: Injuries/Conditions (Multiple choice)          ║
   ║                                                          ║
   ║  2. GET THE FORM ACTION URL                              ║
   ║     - Click the "Send" button on your Google Form        ║
   ║     - Click the link icon (🔗) to get the sharable link  ║
   ║     - The link looks like:                               ║
   ║       https://docs.google.com/forms/d/e/FORM_ID/viewform║
   ║     - Replace "viewform" with "formResponse"             ║
   ║     - That's your action URL!                            ║
   ║                                                          ║
   ║  3. GET THE ENTRY IDs                                    ║
   ║     - Open your Google Form in a browser                 ║
   ║     - Click the 3 dots menu (⫶) → "Get pre-filled link" ║
   ║     - Fill in dummy answers for ALL 9 questions          ║
   ║     - Click "Get link" at the bottom                     ║
   ║     - Copy the generated link                            ║
   ║     - In the URL, you'll see parameters like:            ║
   ║       entry.123456789=Male&entry.987654321=25&...        ║
   ║     - Each "entry.XXXXXXXXX" is the ID for that field    ║
   ║     - Map them to your questions in order                ║
   ║                                                          ║
   ║  4. UPDATE THE CONFIG BELOW                              ║
   ║     - Replace 'YOUR_GOOGLE_FORM_ID' with your form ID   ║
   ║     - Replace each 'entry.XXXXXXXXX' with the real IDs  ║
   ║                                                          ║
   ╚══════════════════════════════════════════════════════════╝
*/

// =============================================
// CONFIGURATION — Replace these with your values
// =============================================
const GOOGLE_FORM_CONFIG = {
    actionUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSc9YL-DnRwfeZaEqKZjY6cNHO_VhR5E0rKIbSGyseWG0FEixQ/formResponse',

    entryIds: {
        gender: 'entry.1419009173',  // Q1: Gender
        age: 'entry.567734741',   // Q2: Age
        height: 'entry.888202487',   // Q3: Height (cm)
        weight: 'entry.1072545770',  // Q4: Weight (kg)
        goal: 'entry.1424674019',  // Q5: Primary Fitness Goal
        frequency: 'entry.1842816472',  // Q6: Workout Frequency (per week)
        duration: 'entry.1096730959',  // Q7: Session Duration
        location: 'entry.885566683',   // Q8: Exercise Location
        injuries: 'entry.996967287',   // Q9: Injuries / Conditions
    }
};


document.addEventListener('DOMContentLoaded', () => {

    // ===========================
    // Mobile Menu Toggle
    // ===========================
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');

    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        });

        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // ===========================
    // Form Elements
    // ===========================
    const form = document.getElementById('madlibsForm');
    const submitBtn = document.getElementById('consultSubmitBtn');
    const progressFill = document.getElementById('progressFill');
    const progressCount = document.getElementById('progressCount');
    const successOverlay = document.getElementById('successOverlay');

    // All form fields
    const fields = {
        gender: document.getElementById('fieldGender'),
        age: document.getElementById('fieldAge'),
        height: document.getElementById('fieldHeight'),
        weight: document.getElementById('fieldWeight'),
        goal: document.getElementById('fieldGoal'),
        frequency: document.getElementById('fieldFrequency'),
        duration: document.getElementById('fieldDuration'),
        location: document.getElementById('fieldLocation'),
        injuries: document.getElementById('fieldInjuries'),
    };

    const totalFields = Object.keys(fields).length; // 9

    // ===========================
    // Progress Tracking
    // ===========================
    function updateProgress() {
        let filled = 0;

        Object.values(fields).forEach(field => {
            const hasValue = field.value && field.value.trim() !== '';
            if (hasValue) {
                filled++;
                field.classList.add('filled');
                field.classList.remove('error');
            } else {
                field.classList.remove('filled');
            }
        });

        // Update progress bar
        const percentage = (filled / totalFields) * 100;
        progressFill.style.width = percentage + '%';
        progressCount.textContent = filled;

        // Enable/disable submit button
        submitBtn.disabled = filled < totalFields;
    }

    // Listen for changes on all fields
    Object.values(fields).forEach(field => {
        field.addEventListener('change', updateProgress);
        field.addEventListener('input', updateProgress);
    });

    // ===========================
    // Form Validation
    // ===========================
    function validateForm() {
        let isValid = true;

        Object.entries(fields).forEach(([key, field]) => {
            if (!field.value || field.value.trim() === '') {
                field.classList.add('error');
                isValid = false;

                // Remove error class after animation
                setTimeout(() => field.classList.remove('error'), 600);
            }

            // Number field range validation
            if (field.type === 'number' && field.value) {
                const val = parseInt(field.value);
                const min = parseInt(field.min);
                const max = parseInt(field.max);
                if (val < min || val > max) {
                    field.classList.add('error');
                    isValid = false;
                    setTimeout(() => field.classList.remove('error'), 600);
                }
            }
        });

        return isValid;
    }

    // ===========================
    // Google Forms Submission
    // ===========================
    function submitToGoogleForm(formData) {
        const params = new URLSearchParams();

        params.append(GOOGLE_FORM_CONFIG.entryIds.gender, formData.gender);
        params.append(GOOGLE_FORM_CONFIG.entryIds.age, formData.age);
        params.append(GOOGLE_FORM_CONFIG.entryIds.height, formData.height);
        params.append(GOOGLE_FORM_CONFIG.entryIds.weight, formData.weight);
        params.append(GOOGLE_FORM_CONFIG.entryIds.goal, formData.goal);
        params.append(GOOGLE_FORM_CONFIG.entryIds.frequency, formData.frequency);
        params.append(GOOGLE_FORM_CONFIG.entryIds.duration, formData.duration);
        params.append(GOOGLE_FORM_CONFIG.entryIds.location, formData.location);
        params.append(GOOGLE_FORM_CONFIG.entryIds.injuries, formData.injuries);

        // Submit via fetch (no-cors mode since Google Forms doesn't allow CORS)
        // The response will be opaque, but the data WILL be recorded in Google Forms
        fetch(GOOGLE_FORM_CONFIG.actionUrl, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: params.toString(),
        })
            .then(() => {
                console.log('✅ Data sent to Google Forms successfully');
            })
            .catch((error) => {
                console.warn('⚠️ Google Forms submission error (data may still be recorded):', error);
            });
    }

    // ===========================
    // Form Submit Handler
    // ===========================
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        // Collect form data
        const formData = {
            gender: fields.gender.value,
            age: fields.age.value,
            height: fields.height.value,
            weight: fields.weight.value,
            goal: fields.goal.value,
            frequency: fields.frequency.value,
            duration: fields.duration.value,
            location: fields.location.value,
            injuries: fields.injuries.value,
        };

        // Update button to show sending state
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 6v6l4 2"/>
      </svg>
      Sending...
    `;

        // Send to Google Forms
        submitToGoogleForm(formData);

        // Show success overlay after a brief delay (for UX feel)
        setTimeout(() => {
            successOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }, 800);
    });

    // ===========================
    // Nav background on scroll
    // ===========================
    const nav = document.querySelector('.nav');
    if (nav) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 60) {
                nav.style.background = 'rgba(250,250,250,0.95)';
                nav.style.boxShadow = '0 1px 8px rgba(0,0,0,0.06)';
            } else {
                nav.style.background = 'rgba(250,250,250,0.85)';
                nav.style.boxShadow = 'none';
            }
        });
    }

});
