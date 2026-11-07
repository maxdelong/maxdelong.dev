# Feature Specification: Dog Breeds and Upgrades

**Feature Branch**: `004-dog-breeds-and-upgrades`

**Created**: 2026-11-06

**Status**: Implemented

**Input**: User description: "Make the dog game have more towers, mechanics and dog breeds. German Shepherds should be the best breed. Take inspiration from Bloons."

This replaces the game rules in `003-dog-tower-defense`. It borrows genre mechanics only (rounds, upgrade paths, enemy traits and free placement). Its names, art, intruders and map are original.

## Requirements

### Dogs

- **FR-001**: The shop MUST offer seven breeds: Chihuahua, Beagle, Corgi, Labrador, Golden Retriever, Husky and German Shepherd.
- **FR-002**: Dogs MUST be placeable on any open grass, but not on a path, the pond, the porch or another dog.
- **FR-003**: Each breed MUST have two upgrade paths of three tiers, and only one path MAY go past tier 1.
- **FR-004**: A placed dog MUST be sellable for 70% of everything spent on it.
- **FR-005**: The visitor MUST be able to choose whether a biting or throwing dog targets the first, last, strongest or closest intruder.
- **FR-006**: Attack types MUST differ: bites and balls hit a limited number of intruders, and howls hit everything in range.
- **FR-007**: Support dogs MUST be able to slow intruders, earn bones each round, and speed up or strengthen nearby dogs.

### The German Shepherd

- **FR-008**: It MUST have the highest damage per second of any breed at every upgrade level.
- **FR-009**: It MUST see hidden intruders and hit prickly ones without any upgrade.
- **FR-010**: It MUST be the only breed with an ability: Alpha Command makes every dog attack three times as fast for 8 seconds, then recharges for 40 seconds.
- **FR-011**: It MUST NOT be affordable at the start of the game.

### Intruders and rounds

- **FR-012**: The game MUST have twenty rounds, each started by the visitor unless Auto is on.
- **FR-013**: Hidden intruders MUST only be targetable by dogs that can see them.
- **FR-014**: Prickly intruders MUST ignore bites and balls unless the dog has the right upgrade. Howls MUST affect them.
- **FR-015**: Skunks MUST stun nearby dogs when defeated.
- **FR-016**: Bosses MUST split into smaller intruders when defeated, and take half the slow from herding.
- **FR-017**: The next round's intruders MUST be shown before it starts, with a warning for hidden and prickly ones.
- **FR-018**: Game speed MUST NOT depend on frame rate, and the visitor MUST be able to run it at 1×, 2× or 3×.

## Success Criteria

Automated tests play whole games with a bot to enforce these:

- **SC-001**: No dogs loses by round 3.
- **SC-002**: The German Shepherd is the only breed that can clear all twenty rounds alone.
- **SC-003**: A mixed team led by Shepherds wins with more than half its lives left.
- **SC-004**: An economy build with Golden Retrievers also wins.
- **SC-005**: A strong team with no Shepherds reaches at least round 15 but doesn't win.

## Assumptions

- No saving: a reload starts a new game.
- The canvas needs a mouse or touch to play. Keyboard play is in the backlog.
- Docs are published in `docs/dog-tower-defense.md`, and a test checks its prices and stats against the game data.

## Status

Implemented and checked by automated tests and a scripted playthrough of the production build in headless Chrome. Not yet tested by a person, so pacing and difficulty may need tuning.
