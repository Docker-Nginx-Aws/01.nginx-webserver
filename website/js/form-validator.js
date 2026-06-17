/* ============================================================
   form-validator.js - Contact Form Validation
   ============================================================ */

'use strict';

// Initialize when contact page loads
document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('contactForm');
    if (!form) return;  // Only runs on contact page

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        if (validateForm()) {
            submitForm();
        }
    });

    // Real-time validation on blur
    form.querySelectorAll('input, textarea').forEach(function (field) {
        field.addEventListener('blur', function () {
            validateField(this);
        });
    });
});

function validateForm() {
    const fields = document.querySelectorAll('#contactForm [required]');
    let isValid = true;
    fields.forEach(function (field) {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    return isValid;
}

function validateField(field) {
    clearError(field);

    if (!field.value.trim()) {
        showError(field, field.getAttribute('data-label') + ' is required');
        return false;
    }

    if (field.type === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(field.value)) {
            showError(field, 'Please enter a valid email address');
            return false;
        }
    }

    if (field.name === 'phone' && field.value) {
        const phoneRegex = /^[6-9]\d{9}$/;  // Indian mobile number
        if (!phoneRegex.test(field.value.replace(/\s/g, ''))) {
            showError(field, 'Please enter a valid 10-digit Indian mobile number');
            return false;
        }
    }

    return true;
}

function showError(field, message) {
    field.classList.add('error');
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    field.parentNode.appendChild(errorDiv);
}

function clearError(field) {
    field.classList.remove('error');
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) existingError.remove();
}

function submitForm() {
    const submitBtn = document.querySelector('#contactForm .btn-primary');
    const originalText = submitBtn.textContent;

    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    // Simulate form submission (replace with actual API call)
    setTimeout(function () {
        submitBtn.textContent = '✅ Message Sent!';
        submitBtn.style.backgroundColor = '#10b981';

        setTimeout(function () {
            document.getElementById('contactForm').reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            submitBtn.style.backgroundColor = '';
        }, 3000);
    }, 1500);
}