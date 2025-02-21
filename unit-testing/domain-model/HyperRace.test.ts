import { HyperRace } from './HyperRace';
import fc from 'fast-check';
import { HyperTeam } from './HyperTeam';

describe('HyperRace unit tests (white box)', () => {
	test('discussMeaningOfLife увеличивает уровень споров и снижает настроение', () => {
		const race = new HyperRace();
		const initialStatus = race.getStatus();
		race.discussMeaningOfLife();
		const newStatus = race.getStatus();
		expect(newStatus.disputeLevel).toBe(initialStatus.disputeLevel + 10);
		expect(newStatus.ultraCricketMood).toBe(initialStatus.ultraCricketMood - 5);
	});

	test('playUltraCricket при успехе увеличивает настроение', () => {
		const race = new HyperRace();
		const initialStatus = race.getStatus();
		race.playUltraCricket(true);
		const newStatus = race.getStatus();
		expect(newStatus.ultraCricketMood).toBe(
			initialStatus.ultraCricketMood + 15,
		);
	});

	test('playUltraCricket при неудаче увеличивает уровень споров и снижает настроение', () => {
		const race = new HyperRace();
		const initialStatus = race.getStatus();
		race.playUltraCricket(false);
		const newStatus = race.getStatus();
		expect(newStatus.disputeLevel).toBe(initialStatus.disputeLevel + 5);
		expect(newStatus.ultraCricketMood).toBe(
			initialStatus.ultraCricketMood - 10,
		);
	});

	test('resolveIssues выбрасывает ошибку, если уровень споров недостаточен', () => {
		const race = new HyperRace();
		expect(() => race.resolveIssues()).toThrow('Уровень споров слишком низкий');
	});

	test('resolveIssues решает вопросы и сбрасывает споры', () => {
		const race = new HyperRace();
		// два вызова discussMeaningOfLife дают уровень споров = 20
		race.discussMeaningOfLife();
		race.discussMeaningOfLife();
		race.resolveIssues();
		const status = race.getStatus();
		expect(status.issuesResolved).toBe(true);
		expect(status.disputeLevel).toBe(0);
	});

	test('после resolveIssues нельзя обсуждать или играть', () => {
		const race = new HyperRace();
		race.discussMeaningOfLife();
		race.discussMeaningOfLife();
		race.resolveIssues();
		expect(() => race.discussMeaningOfLife()).toThrow();
		expect(() => race.playUltraCricket(true)).toThrow();
	});

	test('resetDisputes сбрасывает уровень споров', () => {
		const race = new HyperRace();
		race.discussMeaningOfLife();
		race.discussMeaningOfLife();
		race.resetDisputes();
		expect(race.getStatus().disputeLevel).toBe(0);
	});

	test('resetDisputes выбрасывает ошибку, если вопросы решены', () => {
		const race = new HyperRace();
		race.discussMeaningOfLife();
		race.discussMeaningOfLife();
		race.resolveIssues();
		expect(() => race.resetDisputes()).toThrow();
	});
});

describe('HyperRace property-based tests', () => {
	test('после последовательности валидных действий уровень споров неотрицательный', () => {
		fc.assert(
			fc.property(
				// последовательность действий:
				// > обсуждение
				// > игра (успех или неудача)
				// > сброс споров.
				fc.array(
					fc.constantFrom('discuss', 'playSuccess', 'playFailure', 'reset'),
					{ minLength: 1, maxLength: 20 },
				),
				(actions) => {
					const race = new HyperRace();
					for (const action of actions) {
						try {
							if (action === 'discuss') {
								race.discussMeaningOfLife();
							} else if (action === 'playSuccess') {
								race.playUltraCricket(true);
							} else if (action === 'playFailure') {
								race.playUltraCricket(false);
							} else if (action === 'reset') {
								race.resetDisputes();
							}
						} catch (e) {
							// Игнорируем ошибки, так как негативные кейсы тоже допустимы
						}
					}
					const status = race.getStatus();
					return status.disputeLevel >= 0;
				},
			),
		);
	});
});

describe('Hyper Team', () => {
	let team: HyperTeam;
	let member: HyperRace;

	beforeEach(() => {
		team = new HyperTeam();
		member = new HyperRace();
	});

	test('add those fucking members', () => {
		expect(team.getSize()).toBe(0);
		team.addMember(member);
		expect(team.getSize()).toBe(1);
	});

	test('not more than 20 megamozgs', () => {
		for (let i = 0; i < 20; i++) {
			team.addMember(new HyperRace());
		}
		expect(() => team.addMember(new HyperRace())).toThrow(
			'Нельзя добавить больше 20 участников в команду.',
		);
	});

	test('removing works', () => {
		team.addMember(member);
		team.addMember(new HyperRace());
		expect(team.getSize()).toBe(2);
		team.removeMember(0);
		expect(team.getSize()).toBe(1);
		team.removeMember(0);
		expect(team.getSize()).toBe(0);
		expect(() => team.removeMember(0)).toThrow('Геноцид');
	});

	test('teamDiscuss rises sdiscuss, lowers mood', () => {
		team.addMember(new HyperRace());
		team.addMember(new HyperRace());
		const beforeStatus = team.getTeamStatus();
		team.teamDiscuss();
		const afterStatus = team.getTeamStatus();
		expect(afterStatus.avgDispute).toBeCloseTo(beforeStatus.avgDispute + 10, 5);
		expect(afterStatus.avgMood).toBeCloseTo(beforeStatus.avgMood - 5, 5);
	});
});
