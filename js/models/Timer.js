class Timer extends EventTarget {
    constructor() {
        super();
        this.totalSeconds = 0;
        this.remainingSeconds = 0;
        this.intervalId = null;
        this.isRunning = false;
    }

    start(minutes) {
        if (this.isRunning) return;

        this.totalSeconds = minutes * 60;
        this.remainingSeconds = this.totalSeconds;
        this.isRunning = true;

        this._notifyUpdate();
        this._startInterval();
    }

    resume() {
        if (this.isRunning || this.remainingSeconds <= 0) return;
        this.isRunning = true;
        this._notifyUpdate();
        this._startInterval();
    }

    _startInterval() {
        const endTime = Date.now() + (this.remainingSeconds * 1000);

        this.intervalId = setInterval(() => {
            const now = Date.now();
            const difference = endTime - now;

            if (difference <= 0) {
                this.remainingSeconds = 0;
                this._notifyUpdate();
                this.stop();
                this.dispatchEvent(new Event('timer-complete'));
            } else {
                const secondsLeft = Math.ceil(difference / 1000);
                if (secondsLeft !== this.remainingSeconds) {
                    this.remainingSeconds = secondsLeft;
                    this._notifyUpdate();
                }
            }
        }, 100);
    }

    stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        this.isRunning = false;
    }

    reset() {
        this.stop();
        this.remainingSeconds = 0;
        this.totalSeconds = 0;
        this._notifyUpdate();
    }

    _notifyUpdate() {
        const event = new CustomEvent('timer-update', {
            detail: {
                remainingSeconds: this.remainingSeconds,
                totalSeconds: this.totalSeconds,
                formattedTime: this._formatTime(this.remainingSeconds)
            }
        });
        this.dispatchEvent(event);
    }

    _formatTime(totalSeconds) {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        const paddedSeconds = seconds < 10 ? `0${seconds}` : seconds;
        const paddedMinutes = minutes < 10 ? `0${minutes}` : minutes;
        return `${paddedMinutes}:${paddedSeconds}`;
    }
}
