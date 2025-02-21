export class HyperRace {
	private disputeLevel: number;
	private ultraCricketMood: number;
	private issuesResolved: boolean;

	constructor() {
		this.disputeLevel = 0;
		this.ultraCricketMood = 100;
		this.issuesResolved = false;
	}

	public discussMeaningOfLife(): void {
		if (this.issuesResolved) {
			throw new Error('Вопросы уже решены, споры больше не нужны.');
		}
		this.disputeLevel += 10;
		this.ultraCricketMood -= 5;
	}

	public playUltraCricket(success: boolean): void {
		if (this.issuesResolved) {
			throw new Error('Вопросы решены, нет смысла играть в крикет.');
		}
		if (success) {
			this.ultraCricketMood += 15;
		} else {
			this.disputeLevel += 5;
			this.ultraCricketMood -= 10;
		}
	}

	public resolveIssues(): void {
		if (this.disputeLevel < 20) {
			throw new Error('Уровень споров слишком низкий, чтобы решать вопросы.');
		}
		this.issuesResolved = true;
		this.disputeLevel = 0; // споры сбрасываются
	}

	public resetDisputes(): void {
		if (this.issuesResolved) {
			throw new Error('Вопросы уже решены, споры сброшены.');
		}
		this.disputeLevel = 0;
	}

	public getStatus(): {
		disputeLevel: number;
		ultraCricketMood: number;
		issuesResolved: boolean;
	} {
		return {
			disputeLevel: this.disputeLevel,
			ultraCricketMood: this.ultraCricketMood,
			issuesResolved: this.issuesResolved,
		};
	}
}
