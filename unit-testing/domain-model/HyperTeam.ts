import { HyperRace } from './HyperRace';

export class HyperTeam {
	private members: HyperRace[];
	private readonly maxTeamSize: number = 20;

	constructor() {
		this.members = [];
	}

	public addMember(member: HyperRace): void {
		if (this.members.length >= this.maxTeamSize) {
			throw new Error('Нельзя добавить больше 20 участников в команду.');
		}
		this.members.push(member);
	}

	public removeMember(index: number): void {
		if (index < 0 || index >= this.members.length) {
			if (this.members.length == 0) {
				throw new Error('Геноцид');
			}
			throw new Error('Неверный индекс участника.');
		}
		this.members.splice(index, 1);
	}

	public getSize(): number {
		return this.members.length;
	}

	public teamDiscuss(): void {
		if (this.members.length === 0) {
			throw new Error('В команде нет участников для обсуждения.');
		}
		this.members.forEach((member) => {
			member.discussMeaningOfLife();
		});
	}

	public teamPlayUltraCricket(successes: boolean[]): void {
		if (this.members.length !== successes.length) {
			throw new Error(
				'Количество значений успеха должно соответствовать числу участников.',
			);
		}
		this.members.forEach((member, index) => {
			member.playUltraCricket(successes[index]);
		});
	}

	public teamResetDisputes(): void {
		if (this.members.length === 0) {
			throw new Error('В команде нет участников для сброса споров.');
		}
		this.members.forEach((member) => {
			member.resetDisputes();
		});
	}

	public teamResolveIssues(): void {
		if (this.members.length === 0) {
			throw new Error('В команде нет участников для разрешения проблем.');
		}
		this.members.forEach((member) => {
			member.resolveIssues();
		});
	}

	public getTeamStatus(): {
		avgDispute: number;
		avgMood: number;
		allIssuesResolved: boolean;
	} {
		if (this.members.length === 0) {
			return { avgDispute: 0, avgMood: 0, allIssuesResolved: false };
		}
		let totalDispute = 0;
		let totalMood = 0;
		let resolvedCount = 0;
		this.members.forEach((member) => {
			const status = member.getStatus();
			totalDispute += status.disputeLevel;
			totalMood += status.ultraCricketMood;
			if (status.issuesResolved) {
				resolvedCount++;
			}
		});
		return {
			avgDispute: totalDispute / this.members.length,
			avgMood: totalMood / this.members.length,
			allIssuesResolved: resolvedCount === this.members.length,
		};
	}
}
