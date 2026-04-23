import type { UserIntervention, InterventionType } from "./types";

export class UserInterventionRecorder {
	private interventions: UserIntervention[] = [];

	constructor(interventions: UserIntervention[] = []) {
		this.interventions = interventions;
	}

	record(
		type: InterventionType,
		targetType: "community" | "concept",
		targetId: string,
		details: Record<string, unknown>
	): UserIntervention {
		const intervention: UserIntervention = {
			id: `ui_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
			type,
			targetType,
			targetId,
			details,
			createdAt: Date.now(),
			isActive: true,
		};
		this.interventions.push(intervention);
		return intervention;
	}

	deactivate(id: string): void {
		const intervention = this.interventions.find((i) => i.id === id);
		if (intervention) {
			intervention.isActive = false;
		}
	}

	getActiveInterventions(sinceDays: number = 30): UserIntervention[] {
		const since = Date.now() - sinceDays * 24 * 60 * 60 * 1000;
		return this.interventions.filter(
			(i) => i.isActive && i.createdAt >= since
		);
	}

	getAll(): UserIntervention[] {
		return [...this.interventions];
	}

	isTargetProtected(targetId: string, sinceDays: number = 30): boolean {
		const active = this.getActiveInterventions(sinceDays);
		return active.some((i) => i.targetId === targetId);
	}

	getInterventionsForTarget(targetId: string): UserIntervention[] {
		return this.interventions.filter((i) => i.targetId === targetId);
	}

	getInterventionsByType(type: InterventionType): UserIntervention[] {
		return this.interventions.filter((i) => i.type === type);
	}
}
