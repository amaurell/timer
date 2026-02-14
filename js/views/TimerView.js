class TimerView {
    constructor() {
        this.inputElement = document.getElementById('timer-input');
        this.startButton = document.getElementById('btn-start');
        this.resetButton = document.getElementById('btn-reset');
        this.displayElement = document.getElementById('timer-display');
        this.statusElement = document.getElementById('timer-status');
        this.errorMessageElement = document.getElementById('error-message');
        this.inputElement.addEventListener('input', (e) => this.filterInput(e));

        this.modal = document.getElementById('error-modal');
        this.closeModalBtn = document.getElementById('btn-close-modal');
        if (this.closeModalBtn) {
            this.closeModalBtn.addEventListener('click', () => {
                this.closeModal();
                this.inputElement.focus();
            });
        }
    }

    filterInput(e) {
        // Remove non-digits immediately
        this.inputElement.value = this.inputElement.value.replace(/[^0-9]/g, '');
    }

    updateDisplay(timeString) {
        this.displayElement.textContent = timeString;
    }

    updateStatus(message) {
        this.statusElement.textContent = message.toUpperCase();
    }


    openModal() {
        if (this.modal) {
            this.modal.style.display = 'flex';
        }
    }

    closeModal() {
        if (this.modal) {
            this.modal.style.display = 'none';
        }
    }

    showError(message) {
        // Override standard error to use modal instead if preferred
        // We will keep existing show error for inline, but mainly use modal on start click
        console.error(message); // Log it
    }

    clearError() {
        this.errorMessageElement.textContent = '';
        this.errorMessageElement.style.display = 'none';
    }

    getInput() {
        return this.inputElement.value;
    }

    clearInput() {
        this.inputElement.value = '';
    }

    bindStart(handler) {
        this.startButton.addEventListener('click', handler);
    }

    bindPause(handler) {
        document.getElementById('btn-pause').addEventListener('click', handler);
    }

    bindStop(handler) {
        document.getElementById('btn-stop').addEventListener('click', handler);
    }

    bindReset(handler) {
        if (this.resetButton) {
            this.resetButton.addEventListener('click', handler);
        }
    }
    togglePauseStyle(isPaused) {
        const pauseBtn = document.getElementById('btn-pause');
        if (isPaused) {
            pauseBtn.classList.add('btn-paused');
        } else {
            pauseBtn.classList.remove('btn-paused');
        }
    }
}
