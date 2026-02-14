class TimerController {
    constructor(model, view) {
        this.model = model;
        this.view = view;

        this.view.bindStart(this.handleStart.bind(this));
        this.view.bindPause(this.handlePause.bind(this));
        this.view.bindStop(this.handleStop.bind(this));

        this.model.addEventListener('timer-update', (e) => {
            this.view.updateDisplay(e.detail.formattedTime);
        });

        this.model.addEventListener('timer-complete', () => {
            this.view.updateDisplay('00:00');
            this.view.updateStatus('FINISHED');
            this.view.togglePauseStyle(false);
            // Brutalist specific: flash background or alert
            document.body.style.backgroundColor = 'var(--color-danger)';
            setTimeout(() => {
                document.body.style.backgroundColor = 'var(--color-background)';
            }, 500);
        });
    }

    handleStart() {
        const input = this.view.getInput();
        this.view.updateStatus("START");

        try {
            this.view.clearError();

            // Resume logic if paused
            if (!this.model.isRunning && this.model.remainingSeconds > 0) {
                this.model.resume();
                this.view.togglePauseStyle(false);
                this.view.updateStatus("START");
                return;
            }

            if (!input || input.trim() === '') {
                // Show modal if empty
                this.view.openModal();
                return;
            }

            if (!Validator.isValidTimeInput(input)) {
                // Fallback catch, should be filtered already by View
                this.view.openModal();
                return;
            }

            const minutes = Validator.sanitizeTimeInput(input);
            this.view.togglePauseStyle(false);
            this.model.start(minutes);
            this.view.updateStatus("START"); // Ensure status is explicitly set to START when starting
        } catch (error) {
            this.view.showError(error.message);
        }
    }

    handlePause() {
        if (this.model.isRunning) {
            this.model.stop();
            this.view.updateStatus("PAUSED");
            this.view.togglePauseStyle(true);
        } else if (this.model.remainingSeconds > 0) {
            this.model.resume();
            this.view.togglePauseStyle(false);
        }
    }

    handleStop() {
        this.model.reset();
        this.view.updateDisplay("00:00");
        this.view.updateStatus("STOPPED");
        this.view.clearInput();
        this.view.togglePauseStyle(false);
    }
}
