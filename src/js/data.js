function getHostname() {
	return 'http://www.superpowersgame.com/scripts';
}
function getSuperpowersData() {
	var obj = {};
	obj.superpowers = ['Neutral', 'United States', 'European Union', 'Russian Republic', 'Imperial Japan', 'Communist China', 'Middle-East Federation', 'African Coalition', 'Latin Alliance'];
	obj.units = populateUnits();
	obj.techs = getTechs();
	obj.ranks = getAllRanks();
	return obj;
}
function populateUnits() {
	// type 1=ground, 2=air, 3=water, 4=chopper (land,air & water)
	var units = [];
	units.push({ id: 0, name: 'none', type: 1, subType: 'soldier', cost: 0, move: 1, att: 1, numAtt: 0, def: 0, cas: 99, desc: [''] });
	units.push({ id: 1, name: 'Artillery', type: 1, subType: 'vehicle', cost: 5, move: 1, att: 2, numAtt: 3, def: 1, cas: 5, returnFlg: true, spotterReq: true, desc: ['These are special attack weapons that have very limited defense capabilities. Artillery units attack into an adjacent territory without actually entering it. Each unit rolls 3 dice and a hit is scored for each roll of 2 or lower. They attack at the same time as the other attacking units, but are only used in the first round of battle. Artillery cannot be hit when attacking and remain in their original territory during and after the battle.', 'Extra dice added for Rocketry, Chemical Warheads and Anthrax Warheads technologies.', 'Can also fire into water, rolling 3 dice total.'] });
	units.push({ id: 2, name: 'Infantry', type: 1, subType: 'soldier', cost: 3, move: 1, att: 1, numAtt: 1, def: 2, cas: 2, desc: ['Infantry are necessary for a strong defense as each costs only 3 coins and they defend at the same rate as tanks. Each unit represents one division of soldiers. They have a movement value of 1 and can be transported by bomber or transport ship.', 'Also, any infantry unit can act as a paratrooper division and get dropped into action by Bombers. Limit of 2 infantry per bomber.'] });
	units.push({ id: 3, name: 'Tank', type: 1, subType: 'vehicle', cost: 5, move: 2, att: 3, numAtt: 1, def: 2, cas: 5, desc: ['Tanks can attack and defend in land territories. They can also be transported across sea zones by transport ships.', 'Tanks have a movement value of 2, however to move two spaces, the first move must be into a friendly or unoccupied territory. Note: tanks CANNOT blitz through territories with a battle marker, even if it is unoccupied. They also cannot move into or through newly conquered territories.', 'Amphibious assaults - Tanks, like infantry, have the ability to be picked up by transport ships and dropped directly into an enemy controlled territory. However, cargo must be on the coast at the beginning of the turn, and cannot move once dropped off. Blitzing is not an option for tanks following an amphibious landing.'] });
	units.push({ id: 4, name: 'Transport', type: 3, subType: 'transport', cost: 8, move: 2, att: 1, numAtt: 1, def: 1, cas: 7, desc: ['Transports are special ships used to move land units from one coastal territory or island to another. Transports attack and defend with a "1".', 'One transport can carry up to 4 infantry or 2 tanks or 2 artillery or 2 nuclear missiles. They can also carry combinations of each.', 'In addition they can carry up to 2 air defense units which do not take up cargo space. These units will help defend the fleet against air attacks.', 'A transport can pick up cargo, move and unload all in the same turn. For example a transport could pick up two infantry units, move 1 space, pick up a tank, move another space and unload all in the same turn. Once it unloads cargo, its turn is over. All cargo must be on the coast at the beginning of the turn, and cannot move once unloaded. For example, tanks cannot move one space, and then get picked up by a transport, all in the same turn.', 'Any air defense units on board are able to defend against planes. Other cargo units are not able to attack or defend when loaded on the transport and cannot be used as hits. If the transport is sunk, all the cargo goes down with it. '] });
	units.push({ id: 5, name: 'Submarine', type: 3, subType: 'ship', target: 'noplanes', cost: 8, move: 2, att: 2, numAtt: 1, def: 2, cas: 8, desc: ['Subs attack and defend in sea zones. They cannot transport any units except for Leaders and Generals.', 'Subs attack and defend at a relatively weak die roll of "2", but they conduct a deadly sneak attack. This means any hits from attacking subs are removed from the board without the chance of counter-attack. This advantage extends to all rounds of combat. Regardless of whether the sub hits or misses, they are still susceptible to enemy counterattacks from all remaining units. Defending subs do not get this advantage.', 'Subs can attack enemy ships and helicopters, but not planes. They can however be hit by planes. This means any hit scored by a sub, must be used against a ship. For example say an aircraft carrier and a fighter attack a sub. If the sub scores a hit, the carrier goes down.', 'Dive: Subs have another unique ability in the form of diving to escape planes. If sub are attacked by just planes, they will dive after the first round of battle and can not be targeted any further during that attack. They will not dive if enemy ships are involved in the attack, and will, instead stay and fight it out.', 'Cruise Missiles: In addition to regular attacks, with Cruise Missile technology, subs can fire at an adjacent land territory. This is a free attack with no way to defend against the strike. Subs need a "3" or lower to hit and casualties do not get to return fire.'] });
	units.push({ id: 6, name: 'Fighter', type: 2, subType: 'fighter', cost: 10, move: 4, att: 3, numAtt: 1, def: 4, cas: 10, targetDroneFlg: true, desc: ['Fighters can attack and defend in land and sea zones, and have a flight range of 4 spaces.', 'Fighters must always return after the battle which means they can move 2 spaces to attack and then return.', 'Fighters, unlike ground units, can be hit by enemy AA guns. Each AA gun (up to 2) gets to fire against each attacking fighter. If hit by AA fire, they are immediately destroyed and do not get to attack.'] });
	units.push({ id: 7, name: 'Bomber', type: 2, subType: 'bomber', cost: 15, move: 6, att: 4, numAtt: 1, def: 1, cas: 15, returnFlg: false, desc: ['Bombers provide a huge punch on attacks and can devistate your enemies. They have a movement value of 6 but must return after attacking, meaning attacks consist of 3 spaces out and 3 spaces back.', 'Bombers, unlike ground troops can be hit by enemy AA guns. Each enemy AA gun (up to 2) gets to fire against each attacking bomber. If hit by AA fire, they are immediately destroyed and no not get to attack.', 'Paratroopers: When used for conventional attacks, bombers have the option of transporting and dropping up to 2 infantry as paratroopers. Paratroopers can ONLY be used in battles that also have other ground units attacking. Even if a bomber is hit by AA fire, the paratroopers survive and will be used in the battle.', 'Strategic Bombing: They can also strategically bomb enemy factories to cause economic damage. See below for details.'] });
	units.push({ id: 8, name: 'Aircraft Carrier', type: 3, subType: 'ship', cost: 12, move: 2, att: 1, numAtt: 1, def: 3, cas: 12, desc: ['Carriers attack and defend in sea zones. They cannot carry infantry or tanks, but can transport fighters, leaders and generals.'] });
	units.push({ id: 9, name: 'Battleship', type: 3, subType: 'ship', cost: 15, move: 2, att: 4, numAtt: 1, def: 4, cas: 15, desc: ['Battleships are kings of the sea. They attack and defend in sea zones with a strong "4" for both attacks and defense. They have a movement value of 2, and can be involved in combat with any other sea units or planes. ', 'Battleships come equipped with a single stealth-defeating AA gun which targets all planes and choppers. This AA gun will always target planes, defeating any stealth technology they might have. Limit of 2 stealth-defeating AA guns per territory. You can add additional AA guns to battleships, but only the built-in one will be stealth-defeating.', 'Cruise Missiles: In addition to regular attacks, with Cruise Missile technology, battleships can fire at an adjacent land territory. This is a free attack with no way to defend against the strike. Battleships need a "4" or lower to hit and casualties do not get to return fire.'] });
	units.push({ id: 10, name: 'General', type: 1, subType: 'hero', cost: 0, move: 1, att: 1, numAtt: 1, def: 3, cas: 20, desc: ['Each player begins the game with one General, who is used to help boost the attacking skills of all soldier units he accompanies into battle. Generals have a movement value of 1 and attack along side other military pieces. When your general accompanies the attack, all soldiers (including special units) attack at +1 strength for as long as he remains in the battle.', 'Generals also have the ability to withdraw during or after the battle. This means you can take advantage of higher infantry attacks, and then move him back to his original territory so as not to be left on the front lines.', 'Your General can be transported by bomber or any naval ship and does not take up cargo space. Generals will assist when defending sea battles as well.', 'Generals, like Leaders cannot be killed by nuke attacks as they have secret bunkers available to them.'], generalBonuses: ['United States: All infantry attack at a 3 when joined by this general.', 'European Union: General attacks at a 5, plus moves 2 spaces for attacks and movement.', 'Russian Republic: All tanks attack at a 4 instead of 3 when joined by this general. Also general attacks at a 4.', 'Imperial Empire: One enemy infantry is converted to your army on each round of battle.', 'Communist Dynasty: Attacks with 5 dice, needing 2 or less to hit. Plus can get upgraded with artillery upgrades.', 'MidEast Federation: Kills a plane, tank or infantry on each round of the battle. Casualty does not get to return fire.', 'African Coalition: Attacks and defends with 3 dice, needing 3 or less to hit.', 'Latin Alliance: Defends with 3 dice, needing 5 or less to hit. Also attacks with a 4 or less.'] });
	units.push({ id: 11, name: 'National Leader', type: 1, subType: 'hero', cost: 0, move: 1, att: 1, numAtt: 1, def: 1, cas: 20, desc: ['This is a special unit that can not be replaced if killed. You receive a bonus of 10 coins per turn as long as your leader is alive.', 'Also all vehicles and soldier class units defend at +1 when the leader is present and defending in the battle.', 'Leaders, like Generals can also be transported in bombers or any navy ship.', 'They also are not killed by nukes or EMPs.'] });
	units.push({ id: 12, name: 'Super Battleship', type: 3, subType: 'ship', cost: 15, move: 2, att: 4, numAtt: 1, def: 4, cas: 19, desc: ['Each superpower is allowed one Super Battleship to dominate the oceans. These ships have special upgrades, which are paid for at the time of purchase.', 'Super Battleships include all of the benefits of regular battleships including cruise missiles.', 'They cannot be upgraded once built. You are stuck with that build package until the ship is sunk.'] });
	units.push({ id: 13, name: 'Anti-Aircraft Gun', type: 1, subType: 'aa', cost: 5, move: 1, att: 0, numAtt: 0, def: 0, cas: 99, desc: ['These are special defense units used against planes and nuclear missiles.', 'These units fire first in a battle before the attackers and any hits are immediately removed without a chance to attack.', 'They also help limit damage of nuke attacks. 2 units saved per AA up to 3 AA guns per territory. With anti-balistics tech this defense is doubled, meaning up to 12 casualties can be prevented.', 'These units are not destroyed and are turned over to attackers.'] });
	units.push({ id: 14, name: 'Nuclear Missile', type: 1, subType: 'missile', cost: 20, move: 1, att: 12, numAtt: 1, def: 0, cas: 99, returnFlg: false, desc: ['These intercontinental ballistic weapons of mass destruction are very costly to produce, but can be devastating to your enemies.', 'Nukes have a movement value 1 but once launched, have a range of 2 spaces.', 'They automatically destroy 12 units when used, although the damage can be mitigated if the defender has Air Defense units.', 'With Rocketry, their range is increased to 3. With Chemical Warheads they get 15 hits and a range of 4. With Anthrax Warheads they have a range of 5 and will destroy a maximum of 18 units per missle.', 'Defending Air Defense units will mitigate 2 hits per AD, up to a limit of 3 AD guns. 4 hits per AD mitigated if the defender has Anti-Balistics. So a fully upgraded nuke going against a fully defended land territory will always score 6 hits.', 'Leaders and Generals cannot be killed by nukes.', 'Nukes do 1/3 damage over water.', 'These units do not defend and are handed over to the enemy if captured.'] });
	units.push({ id: 15, name: 'Factory', type: 1, subType: 'building', cost: 15, move: 0, att: 0, numAtt: 0, def: 0, cas: 99, desc: ['Factories act as the gateway for placing newly purchased units. When you buy new units, they must originate at one of your current factories.', 'Additional factories can be purchased on any land territories you own. This allows you to start building new troops on that spot starting with your next turn.', 'Placing a second factory on a territory turns it into an Economic Center, which generates +5 coins per turn.', 'Factories and Economic Centers can be bombed by enemies. See Below for details.'] });
	units.push({ id: 16, name: 'Anti-Balistics', type: 1, subType: 'soldier', cost: 10, move: 1, att: 1, numAtt: 1, def: 2, cas: 99, desc: [''] });
	units.push({ id: 17, name: 'Railway', type: 1, subType: 'soldier', cost: 10, move: 1, att: 1, numAtt: 1, def: 2, cas: 99, desc: [''] });
	units.push({ id: 18, name: 'Technology', type: 1, subType: 'soldier', cost: 10, move: 1, att: 1, numAtt: 1, def: 2, cas: 99, desc: [''] });
	units.push({ id: 19, name: 'Economic Center', type: 1, subType: 'building', cost: 15, move: 0, att: 0, numAtt: 0, def: 0, cas: 99, desc: ['Economic Centers boost your income by 5 coins per turn. Only one allowed per land territory. They can be destroyed by strategic bombing raids.'] });
	units.push({ id: 20, name: 'Humvee', type: 1, subType: 'vehicle', target: 'soldierOnly', cost: 4, move: 2, att: 2, numAtt: 1, def: 5, numDef: 1, cas: 5, flag: 1, targetDroneFlg: true, desc: ['Cheap, mobile units with a strong defense against soldiers but cannot target other types of units (except for drones).'] });
	units.push({ id: 21, name: 'Sniper', type: 1, subType: 'soldier', target: 'soldierOnly', cost: 3, move: 1, att: 3, numAtt: 1, def: 1, cas: 3, flag: 2, desc: ['Snipers give you 3 times the attack strength for the same price as an infantry. They can only hit soldiers. Casualties do not get to return fire.'] });
	units.push({ id: 22, name: 'Mig 29', type: 2, subType: 'fighter', cost: 4, move: 2, att: 3, numAtt: 1, def: 2, cas: 4, flag: 3, returnFlg: false, desc: ['Inexpensive unit with half the range and same attack as a fighter, but for half the cost.', '+1 defense and immune to AA with Stealth, increased range with "Long Range Aircraft" technology, and +1 attack (4) with Maverick Missiles tech.'] });
	units.push({ id: 23, name: 'Kamakazi', type: 2, subType: 'fighter', target: 'kamakazi', cost: 5, move: 2, att: 6, numAtt: 1, def: 1, cas: 5, flag: 4, desc: ['Attacks a single transport, plane or vehicle choosing a target at random. No other types of units can be targets. Kamakazi automatically hits if a target is available, and both units are casualties.', 'This unit has both a movement and attack range of 2. Increased range to 3 with Long Range Aircraft tech, and faces at most 1 AA gun with Stealth tech.'] });
	units.push({ id: 24, name: 'Missile Launcher', type: 1, subType: 'vehicle', cost: 7, move: 1, att: 2, numAtt: 5, def: 1, cas: 7, flag: 5, returnFlg: true, desc: [' Attacks same as artillery except 5 dice needing 2 or less to hit. Upgradable with technology. Requires ground units as spotters.', 'Extra dice added for Rocketry, Chemical Warheads and Anthrax Warheads technologies.', 'Can also fire into water, rolling 3 dice total.'] });
	units.push({ id: 25, name: 'Jihad Bomber', type: 1, subType: 'soldier', cost: 5, move: 1, att: 6, numAtt: 3, def: 1, cas: 6, flag: 6, desc: [' Instantly kills self and 3 enemy units when attacking. Able to attack from transports as well.', 'One extra kill on attacks with Anthrax tech.'] });
	units.push({ id: 26, name: 'RPG Soldier', type: 1, subType: 'soldier', target: 'vehicles', cost: 4, move: 1, att: 3, numAtt: 1, def: 2, cas: 4, flag: 7, desc: ['RPG soldiers are tank killers. If available, they will target tanks and artillery on attack and defense, however are able to hit any type of unit.'] });
	units.push({ id: 27, name: 'Destroyer', type: 3, subType: 'ship', cost: 10, move: 3, att: 3, numAtt: 1, def: 3, cas: 10, flag: 8, desc: ['Fast with strong attack and defense. One of only 2 ships in the game that can move 3 spaces.', 'Destroyers provide special defense against sub attacks. All ships in fleet can return fire when hit by a submarine.'] });
	units.push({ id: 28, name: 'Medic', type: 1, subType: 'soldier', cost: 4, move: 1, att: 1, numAtt: 1, def: 1, cas: 5, flag: 1, desc: ['Heals 1 infantry or soldier casualty per battle on offense or defense.', 'Medics do not heal against nukes or EMPs.'] });
	units.push({ id: 29, name: 'Helicopter', type: 4, subType: 'chopper', cost: 6, move: 2, att: 4, numAtt: 1, def: 1, cas: 6, flag: 2, desc: ['Helicopters are strong attack units that can engage units on land, sea and air. Choppers do not need to return to base and can occupy enemy land territories by themselves.', 'They also count as ground support to allow for paratroopers during an attack.', 'Helicopters face AA guns when attacking, in addition to other defensive units.', 'They face at most 1 AA gun with Stealth, but do NOT get any extra range from technology.'] });
	units.push({ id: 30, name: 'Stinger Soldier', type: 1, subType: 'soldier', target: 'planes', cost: 3, move: 1, att: 2, numAtt: 1, def: 2, cas: 3, flag: 3, targetDroneFlg: true, desc: ['Stinger soldiers provide a strong defense against aircraft as they will target planes first, but can hit any piece encountered.'] });
	units.push({ id: 31, name: 'Flame Thrower', type: 1, subType: 'soldier', target: 'soldierOnly', cost: 3, move: 1, att: 2, numAtt: 2, def: 1, cas: 3, flag: 4, desc: ['Flame throwers give you 4 times the attack strength of a standard infantry, for the same price. The down side is they can only hit soldier class units and have very weak defense.'] });
	units.push({ id: 32, name: 'Insurgent Mob', type: 1, subType: 'soldier', target: 'soldierOnly', cost: 2, move: 1, att: 1, numAtt: 1, def: 1, cas: 1, flag: 5, desc: ['Insurgents are cheap, disposable pieces used as cannon fodder that can only hit soldiers.'] });
	units.push({ id: 33, name: 'Scud Launcher', type: 1, subType: 'vehicle', cost: 8, move: 1, att: 3, numAtt: 4, def: 1, cas: 8, flag: 6, returnFlg: true, desc: ['Fights like artillery, but with 4 dice needing "3"s to hit. Upgradable with technology. Requires infantry or tank spotters.', 'Extra dice added for Rocketry, Chemical Warheads and Anthrax Warheads technologies.', 'Can also fire into water, rolling 3 dice total.'] });
	units.push({ id: 34, name: 'Rocket Buggie', type: 1, subType: 'vehicle', target: 'vehicles', cost: 6, move: 2, att: 4, numAtt: 1, def: 4, cas: 6, flag: 7, targetDroneFlg: true, desc: ['Strong attack piece that targets tanks and artillery (not specialty units) when fighting.', 'Extra attack dice with Anthrax tech.'] });
	units.push({ id: 35, name: 'Special Ops', type: 1, subType: 'soldier', cost: 3, move: 1, att: 4, numAtt: 1, def: 1, cas: 3, flag: 8, returnFlg: true, desc: ['These units sneak into enemy territory and place exposives then return before the battle begins. They are immune to enemy fire and cannot occupy a territory. They are unable to attack from ships.', 'You need at least one ground unit spotter involved in the battle to use Spec-ops.', 'They target tanks/vehicles with AGM Maverick Missiles tech, and get 2 dice with Anthrax tech.'] });
	units.push({ id: 36, name: 'Apache', type: 4, subType: 'chopper', cost: 10, move: 2, att: 4, numAtt: 1, def: 3, cas: 10, flag: 1, desc: ['Apache helicopters attack in air, sea and land. They can occupy and hold a land territory by themselves.', 'Get extra attack dice with Anthrax tech, and face at most 1 Air Defense with Stealth. Also extra movement with Long Range Aircraft tech.'] });
	units.push({ id: 37, name: 'Striker', type: 1, subType: 'vehicle', target: 'planesTanks', cost: 10, move: 2, att: 4, numAtt: 1, def: 4, numDef: 3, cas: 10, flag: 2, targetDroneFlg: true, desc: ['Strikers are strong attack and even stronger defensive units that will target planes and vehicles first. Out of the box you get 1 dice on attack and 3 dice on defense.', 'Comes with AA gun mounted on top, plus can target Predator Drones when defending.', 'Extra attack dice with Anthrax tech.'] });
	units.push({ id: 38, name: 'Nuke Cannon', type: 1, subType: 'vehicle', cost: 10, move: 1, att: 4, numAtt: 4, def: 1, cas: 10, flag: 3, returnFlg: true, desc: ['Nuke Cannons are the most powerful artillery piece in the game. They attack with 4 dice needing 4 or less to hit. Requires infantry or tank spotters.', 'Extra dice added for Rocketry, Chemical Warheads and Anthrax Warheads technologies, to max out at 7 dice per unit.', 'Can also fire into water, rolling 3 dice total.'] });
	units.push({ id: 39, name: 'Cruiser', type: 3, subType: 'ship', cost: 10, move: 2, att: 4, numAtt: 1, def: 2, cas: 10, flag: 4, desc: ['Cruisers are powerful attack ships. They come equipeded with an AD gun and 2 cruise missiles, upgradable to 3 with BGM Tomahawk Missiles technology.', 'This makes them very good against land, sea and air attacks.'] });
	units.push({ id: 40, name: 'Battlemaster', type: 1, subType: 'vehicle', target: 'vehicles', cost: 12, move: 1, att: 4, numAtt: 3, def: 4, numDef: 2, cas: 10, flag: 5, targetDroneFlg: true, desc: ['This is most powerful land unit in the game. Battlemaster tanks will mow down multiple units with a powerful attack and defense. In addition, these units come equiped with an AA gun built in.', 'Gain an extra attack dice with Anthrax tech.'] });
	units.push({ id: 41, name: 'Hijacker', type: 1, subType: 'soldier', target: 'hijacker', cost: 7, move: 1, att: 1, numAtt: 1, def: 3, cas: 7, flag: 6, returnFlg: true, desc: ['Converts 1 plane, chopper or vehicle when attacking, then retreats back to previous country.', 'The converted units can be used by you for subsequent rounds of attack, or are destroyed if you retreat.'] });
	units.push({ id: 42, name: 'Chemical Bomb', type: 1, subType: 'vehicle', target: 'soldierOnly', cost: 10, move: 1, att: 6, numAtt: 7, def: 3, cas: 10, flag: 7, desc: ['Thia is a M.O.A.B. Mother of all bombs. When used for attacks, it destroys itself and 7 enemy infantry in the first round of attack. These bombs will target all soldier class units but will not hit vehicles, planes or other unit types.', '2 Extra kills on attack with Anthrax tech.'] });
	units.push({ id: 43, name: 'Predator Drone', type: 2, subType: 'fighter', cost: 10, move: 4, att: 3, numAtt: 2, def: 1, cas: 10, flag: 8, returnFlg: true, desc: ['Predator Drones are great for scoring free kills against weakly defended land territories. They can fly out 2 spaces and attack any land territory with 2 dice, needing 3 or less to hit. They can ONLY be shot down by Air Defense, fighters and certain special units. Drones only attack on the first round of battle, then fly home.', 'Any fighter defending against a drone will automatically score a hit.', 'With Stealth they are immune to air defense. They get upgraded to target tanks and artillery (not special units) with AGM Maverick Missiles technology. Also range is extended to 3 spaces with Long Range Aircraft tech.', 'When defending, they can be hit by any unit.', 'Specialty units that can shoot them down are: Stinger Soldiers, Rocket Buggies, Humvees, Strikers and Battlemasters.'] });
	units.push({ id: 44, name: 'Navy Seal', type: 4, subType: 'seal', target: 'soldierOnly', cost: 6, move: 1, att: 4, numAtt: 1, def: 0, cas: 99, flag: 1, returnFlg: true, desc: ['Navy Seals are slow-moving, stealthy attack units that can move anywhere on the map, land or water to conduct secret operations against enemy soldiers.', 'These units attack by themselves and cannot be used with other forces. They also cannot be killed.', 'Seals cannot move and attack on the same turn. To attack, choose any adjacent land territory. Seals will move in, conduct a strike, and withdraw without being susceptible to counter-attack.', 'Seals are limited to one space of movement and do not get Railway or Mobility benefits.', 'They are unable to attack a territory with a hero unit on it. Also if a player moves a hero unit onto a territory containing a Seal, the Seal will be stuck in that territory, unable to move or fight, until the hero unit leaves.', 'If the USA Leader or General is killed, all Seals disappear from the map and can no longer be created.', 'Seals do NOT reveal troop counts in fog of war games.'] });
	units.push({ id: 45, name: 'Armored Transport', type: 3, subType: 'transport', cost: 12, move: 2, att: 2, numAtt: 1, def: 2, cas: 11, flag: 2, desc: ['Armored Transports are stronger, more expensive transports that have a higher casualty number than a submarine, meaning subs will be taken as casualties before Armored Transports.', 'Note: Armored Transports can only move once per turn. You cannot move 1 space, pick up units and move again, in the same turn.'] });
	units.push({ id: 46, name: 'T-90', type: 1, subType: 'vehicle', cost: 6, move: 2, att: 4, numAtt: 1, def: 4, cas: 6, flag: 3, desc: ['T-90s are stronger, better armored tanks.', '+1 attack when accompanied by a general and target vehicles with Maverick Missiles Technology.', 'Extra attack dice with Anthrax Warheads.'] });
	units.push({ id: 47, name: 'Laser', type: 1, subType: 'vehicle', cost: 7, move: 1, att: 6, numAtt: 1, def: 1, cas: 7, flag: 4, returnFlg: true, desc: ['Laser fires from the previous territory and targets a single unit, killing it instantly.', 'Casualties of lasers do not get to return fire.', 'Targets vehicles with AGM Maverick Missiles and targets planes with Advanced Radar.', 'Lasers remain in their original territory after the battle.'] });
	units.push({ id: 48, name: 'J-20', type: 2, subType: 'fighter', cost: 12, move: 6, att: 4, numAtt: 1, def: 4, cas: 12, flag: 5, returnFlg: false, desc: ['J-20s are advanced long range fighters.', 'They defend at 5 with stealth, target tanks with AGM Maverick Missiles and target planes with Advanced Radar.', 'Also increased range with technology and 2 dice with Nuclear Warheads.'] });
	units.push({ id: 49, name: 'Patrol Boat', type: 3, subType: 'transport', cost: 6, move: 3, att: 1, numAtt: 1, def: 1, cas: 6, flag: 6, desc: ['Patrol Boats are fast, cheap disposable navy ships. One of only 2 ships in the game that can move 3 spaces.', 'Patrol boats can also carry one soldier unit as cargo for amphibious assaults, although these boats can only be moved once per turn. Meaning you cannot move one space to pick up cargo and then move again.', '+1 attack and defense values with Torpedos Tech.'] });
	units.push({ id: 50, name: 'Cobra', type: 4, subType: 'chopper', cost: 12, move: 2, att: 4, numAtt: 1, def: 2, cas: 12, flag: 7, desc: ['Strong attack helicopter that can carry up to 2 infantry as paratroopers.', '+1 attack when joined by a general. Also extra dice with Nuclear Warheads technology.', 'Cobras do NOT get extra range with technology.'] });
	units.push({ id: 51, name: 'Pickup Truck', type: 1, subType: 'vehicle', target: 'soldierOnly', cost: 3, move: 2, att: 2, numAtt: 1, def: 2, cas: 3, flag: 8, desc: ['Pickup Trucks are cheap disposable units that can only target soldiers.', '+1 attack when joined by a general.'] });
	units.push({ id: 52, name: 'EMP Blast', type: 1, subType: 'missile', cost: 0, move: 5, att: 36, numAtt: 1, def: 0, cas: 99, returnFlg: false, desc: ['EMP Blast is a unique weapon that is ONLY available in Matchmaking games. The cost is 0, and each player has limited number to use, which is indicatd on the "Players" Panel. Each EMP can be used once, across any of your MM games, meaning if you use it in one game, you cannot use it in any other games.', 'You must have all 18 techs researched before you can use an EMP in a game.', '1 EMP does the exact same damage as 3 nukes. See nukes description for details on damage. Additionally EMPs, unlike any other units, are available for use the same round they are bought.', 'Anti-Balistics and AD guns provide similar defense against EMPs.', 'The only way to generate additional EMPs is through playing Matchmaking games. You automatically generate 1 new EMP for each 5 games you play in. With a max of 2 EMPs. Once you have 2 EMPs, you must use one before you will get any more.'] });
	return units;
}
function getTechs() {
	var techs = [];
	var i = 1;
	techs.push({ id: i++, name: 'Stealth', desc: 'All fighters now defend at +1 and are immune to AA guns. Kamakazis face at most 1 AA.' });
	techs.push({ id: i++, name: 'AGM Maverick Missiles', desc: 'All Planes can target tanks and artillery (not special units) when attacking and defending.' });
	techs.push({ id: i++, name: 'Advanced Radar', desc: 'All Fighters scramble against bomb raids. Basic fighters (non-special units) can target other planes attacking and defending. Also bombers face at most 1 AA gun (except against battleships).' });
	techs.push({ id: i++, name: 'Rocketry', desc: ' Artillery now roll 4 dice instead of 3. Nukes have a range of 3.' });
	techs.push({ id: i++, name: 'Chemical Warheads', desc: 'Artillery now roll 5 dice. Nukes get 15 hits and have a range of 4.' });
	techs.push({ id: i++, name: 'Anthrax Warheads', desc: 'Artillery now roll 6 dice. Nukes get 18 hits and have a range of 5.' });
	techs.push({ id: i++, name: 'Homing Torpedoes', desc: 'Your subs now attack and defend at 3' });
	techs.push({ id: i++, name: 'Cruise Missiles', desc: 'Subs and battleships get 1 free attack per turn on any adjacent land territory. Casualties do not get to return fire.' });
	techs.push({ id: i++, name: 'BGM Tomahawk Missiles', desc: 'Cruise missiles now target all vehicles (including special units). Also extra cruise missile dice for all battleships and cruisers (no bonus dice for subs)' });
	techs.push({ id: i++, name: 'Factory Automation', desc: '+5 income bonus per turn' });
	techs.push({ id: i++, name: 'Mass Production', desc: '+5 income bonus per turn' });
	techs.push({ id: i++, name: 'Industry', desc: '+5 income bonus per turn' });
	techs.push({ id: i++, name: 'Heavy Bombers', desc: 'Each of your bombers now roll 2 dice when attacking' });
	techs.push({ id: i++, name: 'Smart Bombs', desc: 'Bombers attack at 5. Fighters attack at 4.' });
	techs.push({ id: i++, name: 'Nuclear Warheads', desc: 'Bombers get 3 dice for all attacks.' });
	techs.push({ id: i++, name: 'Long Range Aircraft', desc: 'Fighters now have a range of 6, bombers have a range of 8' });
	techs.push({ id: i++, name: 'Air Defense Shield', desc: 'Every land territory automatically has 1 AA gun that cannot be destroyed.' });
	techs.push({ id: i++, name: 'Mobility', desc: 'All tanks and infantry have +1 movement during combat phase. Note: Does not affect specialty units, only tanks and infantry.' });
	techs.push({ id: i++, name: 'Anti-ballistics', desc: 'All A.D. units double their defense against nukes.' });
	techs.push({ id: i++, name: 'Advanced Railway', desc: 'All non-combat ground movement is increased by 1.' });
	return techs;
}

function loadSVGs() {
	return [
		{ id: 1, width: '112px', height: '184px', left: '231px', top: '320px', viewBox: '0 0 1460 1840', path: 'M753 1713 c-7 -2 -13 -12 -13 -21 0 -9 -8 -30 -18 -47 -17 -28 -38 -91 -61 -180 -6 -22 -28 -60 -50 -85 -35 -40 -41 -44 -60 -32 -29 17 -56 15 -100 -7 -32 -17 -52 -19 -129 -15 l-91 5 -16 -31 c-9 -17 -26 -35 -38 -41 -20 -9 -22 -15 -17 -82 3 -40 13 -86 23 -104 9 -18 17 -40 17 -50 0 -10 6 -29 13 -43 7 -14 21 -47 31 -73 21 -55 74 -100 139 -118 22 -6 61 -28 86 -50 47 -39 83 -44 95 -14 8 22 70 29 103 11 45 -23 86 -120 77 -184 -5 -44 -3 -52 28 -92 25 -33 42 -46 63 -48 99 -8 125 -24 125 -72 0 -38 27 -52 139 -74 46 -10 102 -26 123 -37 35 -18 38 -23 38 -60 0 -22 5 -49 10 -60 10 -18 13 -18 40 -4 27 14 30 21 30 60 0 33 6 50 20 62 26 22 25 30 -3 37 -27 6 -99 71 -116 103 -23 44 -2 103 37 103 7 0 12 7 12 16 0 13 -7 15 -29 11 -62 -13 -198 66 -217 126 -4 14 -12 17 -29 13 -27 -7 -55 16 -55 45 0 25 -19 59 -47 82 -18 14 -23 29 -23 67 0 37 -6 55 -26 79 -27 33 -44 79 -44 125 0 17 -17 55 -43 95 -59 88 -63 99 -71 152 -5 34 -2 56 14 92 11 25 25 49 30 52 6 3 10 19 10 34 0 16 7 48 15 71 15 43 20 127 9 168 -6 23 -10 24 -31 15z' },
		{ id: 2, width: '112px', height: '184px', left: '209px', top: '304px', viewBox: '0 0 1460 1840', path: 'M460 1625 c-8 -9 -29 -14 -59 -14 -48 1 -72 -7 -131 -42 -46 -28 -50 -35 -50 -96 0 -28 -4 -62 -9 -75 -17 -46 -32 -343 -20 -393 11 -42 10 -47 -20 -91 -17 -26 -31 -58 -31 -71 0 -13 -9 -40 -20 -60 -23 -44 -24 -57 -9 -132 9 -44 8 -96 -5 -247 -9 -105 -13 -205 -10 -221 6 -29 9 -31 66 -37 92 -9 118 -8 118 8 0 31 39 63 85 69 25 4 60 17 78 29 17 13 34 24 37 26 2 2 -9 13 -25 26 -57 46 8 79 86 44 53 -23 61 -23 89 7 13 14 29 25 36 25 19 0 26 17 15 37 -36 70 -46 112 -46 196 0 75 3 91 19 102 24 18 50 5 70 -33 9 -19 12 -50 9 -107 l-5 -80 36 -18 c20 -9 47 -17 60 -17 20 0 25 6 30 45 4 25 15 50 25 57 10 7 23 24 30 37 12 21 10 26 -20 57 -32 33 -32 33 -14 60 16 24 21 26 71 22 l55 -5 -7 31 c-7 39 -52 106 -70 106 -7 0 -29 -7 -48 -17 -30 -14 -39 -14 -67 -3 -17 8 -45 25 -61 38 -16 14 -50 29 -76 34 -38 7 -55 18 -98 63 -53 57 -73 91 -94 160 -7 22 -30 65 -50 96 -35 53 -36 57 -22 84 18 34 11 108 -12 134 -24 27 -19 49 16 67 21 11 47 15 79 12 l48 -5 7 45 c5 32 3 47 -7 53 -22 14 -65 10 -79 -6z' },
		{ id: 3, width: '146px', height: '184px', left: '159px', top: '327px', viewBox: '0 0 1460 1840', path: 'M487 1273 c-13 -21 -27 -51 -31 -66 -11 -44 -49 -77 -90 -77 -19 0 -38 5 -41 10 -10 16 -35 12 -42 -7 -29 -86 -47 -111 -92 -127 -25 -9 -54 -16 -65 -16 -15 0 -17 -5 -11 -27 3 -16 10 -77 15 -138 5 -60 13 -141 19 -180 6 -38 10 -87 11 -107 0 -37 -1 -38 -36 -38 l-35 0 6 -57 c14 -131 15 -135 39 -129 12 3 72 8 132 12 l111 7 0 -34 c1 -19 7 -65 15 -104 13 -66 15 -70 43 -73 16 -2 53 -1 81 3 l52 6 1 87 c0 48 1 153 1 233 -1 140 0 148 29 211 28 64 29 68 19 149 -5 46 -7 98 -4 115 2 18 0 36 -5 41 -10 10 3 60 27 105 8 14 14 41 14 60 0 29 -7 39 -49 70 -31 24 -54 50 -62 73 -7 19 -17 35 -21 35 -4 0 -18 -17 -31 -37z' },
		{ id: 4, width: '146px', height: '184px', left: '110px', top: '328px', viewBox: '0 0 1460 1840', path: 'M406 959 c-52 -27 -87 -38 -101 -35 -14 4 -28 0 -35 -9 -7 -8 -18 -15 -25 -15 -6 0 -20 -9 -29 -19 -10 -11 -29 -24 -44 -31 -31 -13 -56 -58 -85 -155 -17 -56 -21 -94 -20 -192 2 -114 4 -125 33 -185 20 -41 33 -85 37 -125 6 -66 22 -82 48 -46 16 21 35 9 35 -23 l0 -24 315 0 c357 0 328 -8 300 87 -14 47 -18 51 -52 57 -21 3 -74 6 -118 6 -86 0 -96 4 -113 36 -13 26 -35 201 -27 215 4 5 17 9 30 9 50 0 56 8 39 48 -10 23 -19 92 -24 182 -5 80 -11 154 -14 165 -3 11 -8 37 -11 58 -5 32 -9 37 -33 37 -15 0 -63 -19 -106 -41z' },
		{ id: 5, width: '146px', height: '184px', left: '3px', top: '170px', viewBox: '0 0 1460 1840', path: 'M73 884 c-3 -8 -1 -25 5 -37 5 -12 13 -30 16 -40 3 -10 33 -30 66 -46 51 -25 57 -30 38 -35 -13 -3 -32 -6 -44 -6 -31 0 -50 -28 -68 -101 -22 -90 -21 -150 4 -176 16 -18 17 -22 4 -27 -11 -4 -15 -21 -14 -68 1 -35 -4 -81 -9 -103 -6 -22 -8 -64 -4 -92 l6 -53 49 -6 c27 -4 52 -12 54 -19 13 -32 260 -24 474 16 30 5 87 7 125 4 63 -6 73 -4 89 14 15 16 31 21 71 21 37 0 58 6 74 19 13 11 36 23 52 26 23 5 29 12 29 34 0 15 -8 35 -18 45 -11 9 -31 49 -47 89 -22 59 -102 236 -134 297 -20 38 -144 32 -219 -11 -18 -10 -37 -19 -41 -19 -4 0 -32 18 -61 40 -32 24 -65 40 -81 40 -18 0 -30 6 -34 19 -9 28 -94 95 -171 134 -110 56 -198 73 -211 41z' },
		{ id: 6, width: '146px', height: '184px', left: '40px', top: '470px', viewBox: '0 0 1460 1840', path: 'M420 440 c-11 -11 -20 -33 -20 -50 0 -17 -5 -39 -12 -49 -9 -15 -9 -26 0 -47 18 -37 -3 -58 -76 -74 -72 -16 -236 -74 -268 -95 -29 -19 -31 -55 -4 -80 24 -22 60 -17 155 20 39 15 94 30 123 35 104 17 185 71 234 157 16 29 34 56 39 59 13 8 11 68 -3 82 -7 7 -20 12 -31 12 -10 0 -33 11 -51 25 -40 30 -60 31 -86 5z' },
		{ id: 7, width: '146px', height: '184px', left: '565px', top: '252px', viewBox: '0 0 1460 1840', path: 'M821 1079 c-13 -5 -37 -20 -53 -34 -33 -28 -49 -30 -111 -13 -40 10 -47 9 -76 -11 -18 -13 -55 -26 -84 -30 -43 -5 -52 -10 -57 -30 -4 -16 -19 -29 -49 -41 -60 -23 -73 -56 -36 -88 34 -28 27 -47 -24 -70 -52 -23 -168 -131 -177 -166 -5 -22 -2 -31 15 -43 12 -8 33 -32 47 -54 14 -22 32 -39 43 -39 10 0 29 -9 43 -19 13 -11 37 -21 53 -23 17 -2 34 -12 40 -23 6 -11 21 -36 33 -55 20 -32 22 -43 16 -131 -6 -91 -5 -98 14 -108 28 -15 32 -14 32 9 0 11 5 29 12 40 10 15 9 28 -5 67 -23 65 -22 135 1 156 24 22 38 21 78 -4 31 -19 35 -19 56 -5 28 20 66 21 87 2 32 -27 78 -34 190 -28 105 5 115 7 137 30 31 34 38 71 23 120 -10 36 -9 45 10 84 27 56 26 71 -4 146 -27 65 -33 150 -14 169 9 9 5 20 -17 45 -16 19 -43 55 -59 80 -43 67 -103 92 -164 67z' },
		{ id: 8, width: '146px', height: '184px', left: '525px', top: '303px', viewBox: '0 0 1460 1840', path: 'M392 815 c-17 -14 -42 -25 -56 -25 -35 0 -126 -90 -126 -124 0 -13 12 -50 27 -82 23 -51 27 -72 27 -153 l0 -94 -57 -52 c-40 -36 -57 -59 -57 -77 0 -44 21 -59 90 -65 52 -5 68 -11 86 -32 18 -22 25 -24 45 -15 41 19 84 6 119 -37 17 -22 40 -39 51 -39 28 0 59 18 59 34 0 19 55 72 115 111 47 31 83 65 99 93 10 17 -32 140 -61 178 -27 37 -28 45 -7 89 14 30 14 36 0 64 -21 40 -20 58 4 88 26 33 19 55 -30 105 -42 42 -89 51 -126 23 -29 -22 -74 -20 -74 4 0 39 -84 43 -128 6z' },
		{ id: 9, width: '146px', height: '184px', left: '480px', top: '350px', viewBox: '0 0 1460 1840', path: 'M429 750 c-42 -14 -66 -16 -95 -10 -48 11 -61 1 -75 -56 -11 -43 -39 -65 -94 -76 -15 -3 -19 -10 -16 -28 2 -14 4 -47 5 -75 1 -35 9 -64 29 -97 15 -26 27 -53 27 -60 0 -7 11 -31 25 -53 20 -33 24 -53 25 -116 l0 -75 41 -18 c38 -17 41 -17 59 -1 10 9 37 19 59 22 29 4 49 15 72 40 28 31 36 35 67 29 41 -6 104 27 155 82 17 18 63 50 103 72 39 21 75 47 78 57 8 20 -17 43 -48 43 -46 0 -98 23 -138 60 -40 39 -41 40 -34 94 5 49 4 55 -14 61 -11 4 -28 17 -36 30 -9 13 -36 34 -61 46 -24 12 -47 28 -50 35 -6 17 -14 17 -84 -6z' },
		{ id: 10, width: '146px', height: '184px', left: '518px', top: '223px', viewBox: '0 0 1460 1840', path: 'M475 859 c-37 -13 -66 -17 -112 -12 -82 7 -133 -10 -133 -43 0 -30 38 -71 75 -80 24 -6 25 -7 9 -25 -10 -11 -15 -28 -12 -44 5 -21 2 -25 -11 -19 -39 16 -132 16 -176 -1 -79 -30 -85 -75 -20 -141 25 -24 45 -50 45 -57 0 -8 7 -35 16 -61 20 -57 60 -86 119 -86 22 0 46 -4 54 -9 16 -10 30 -77 31 -146 0 -47 17 -88 44 -107 6 -4 32 -8 58 -8 38 0 54 6 82 30 20 18 36 43 39 63 25 141 25 138 -1 169 -23 27 -23 30 -8 47 9 10 16 34 16 53 0 20 6 51 14 69 8 19 17 60 21 91 5 36 14 63 26 74 35 32 36 105 2 140 -14 13 -14 19 -2 41 12 22 11 27 -6 40 -28 22 -81 43 -102 42 -10 -1 -40 -10 -68 -20z m-45 -381 c0 -11 -7 -10 -31 2 -28 16 -23 32 6 18 14 -6 25 -15 25 -20z' },
		{ id: 11, width: '146px', height: '184px', left: '610px', top: '135px', viewBox: '0 0 1460 1840', path: 'M152 1412 c-20 -16 -23 -25 -20 -73 2 -44 -2 -63 -24 -100 -24 -41 -27 -56 -27 -133 1 -77 4 -90 25 -115 13 -16 24 -39 24 -51 0 -12 5 -30 11 -41 6 -13 7 -25 1 -32 -19 -24 -22 -65 -7 -101 8 -19 15 -51 15 -70 0 -27 6 -40 25 -52 35 -23 65 -88 65 -143 0 -35 8 -55 30 -85 17 -22 30 -46 30 -53 0 -8 11 -25 24 -38 14 -13 27 -33 31 -44 10 -33 60 -83 111 -110 39 -21 54 -37 74 -78 38 -80 73 -86 138 -25 29 28 32 34 27 78 -3 27 -10 61 -16 77 -9 22 -9 31 3 45 9 9 18 45 22 79 3 35 13 79 21 99 8 20 15 55 15 78 0 23 7 51 15 62 8 10 15 26 15 34 0 9 14 28 31 43 37 32 36 43 -9 160 -36 93 -41 99 -110 144 -73 46 -138 54 -182 23 -17 -12 -36 -34 -42 -49 -14 -35 -18 -211 -5 -236 8 -17 6 -16 -17 4 -34 32 -66 119 -66 182 0 45 4 55 35 86 19 19 35 43 35 52 0 20 -26 58 -58 86 -19 16 -26 36 -32 90 -13 107 -21 135 -43 147 -12 6 -35 26 -53 44 -36 39 -75 44 -112 16z m382 -838 c10 -25 7 -34 -9 -28 -8 4 -15 15 -15 25 0 23 16 25 24 3z' },
		{ id: 12, width: '146px', height: '184px', left: '580px', top: '346px', viewBox: '0 0 1460 1840', path: 'M505 970 c-4 -6 -21 -17 -40 -24 -37 -16 -53 -49 -34 -72 10 -12 23 -14 56 -9 41 6 46 4 83 -33 22 -22 40 -49 40 -61 0 -27 -71 -131 -102 -150 -51 -31 -111 -89 -144 -138 -19 -29 -39 -55 -44 -58 -6 -3 -10 -21 -10 -39 0 -47 -57 -101 -97 -92 -42 11 -68 12 -70 4 -2 -5 -3 -38 -3 -75 l1 -68 57 -27 c153 -72 166 -77 182 -65 40 32 90 49 122 43 110 -21 113 -21 155 18 41 36 79 46 100 25 22 -22 67 -6 92 34 17 26 49 51 100 80 67 37 83 42 136 41 33 -1 77 -9 99 -18 48 -20 70 -20 86 -1 10 12 9 22 -4 49 -21 45 -20 65 5 92 19 21 20 26 8 79 -7 31 -16 58 -21 61 -4 3 -49 10 -100 16 -66 7 -98 16 -109 28 -8 10 -25 21 -37 24 -32 11 -27 41 13 72 19 14 35 35 35 45 0 10 5 38 12 62 10 41 10 44 -15 70 -17 16 -27 37 -27 55 0 31 -19 46 -44 36 -8 -3 -22 -31 -31 -62 -21 -72 -64 -159 -90 -181 -23 -18 -45 -93 -45 -150 0 -60 -7 -69 -81 -107 -38 -19 -76 -46 -86 -60 -9 -14 -27 -30 -40 -35 -13 -5 -26 -17 -29 -26 -27 -86 -62 -131 -79 -103 -10 17 -25 11 -25 -10 0 -12 -9 -22 -24 -26 -34 -8 -42 -1 -49 42 -5 28 -1 43 13 62 11 13 20 31 20 39 0 15 44 104 72 145 10 15 32 30 50 33 18 4 45 20 61 36 15 16 48 45 73 65 24 20 44 40 44 44 0 4 -15 11 -32 17 -29 8 -33 13 -33 43 -1 44 -28 96 -71 137 -26 25 -34 40 -34 67 0 33 -2 36 -29 36 -17 0 -33 -5 -36 -10z' },
		{ id: 13, width: '170px', height: '266px', left: '781px', top: '98px', viewBox: '0 0 1700 2660', path: 'M507 2557 c-23 -18 -41 -21 -113 -22 l-86 0 -34 -40 c-18 -22 -48 -57 -66 -77 -47 -54 -47 -52 4 -94 8 -6 19 -44 26 -86 11 -64 17 -77 37 -86 14 -6 28 -24 31 -39 4 -15 15 -44 25 -63 26 -54 33 -123 15 -159 -20 -38 -20 -100 -1 -125 19 -26 19 -107 0 -153 -8 -19 -15 -62 -15 -94 0 -51 -4 -62 -30 -89 -17 -18 -31 -45 -35 -67 -3 -21 -10 -63 -15 -94 -6 -30 -10 -67 -10 -82 0 -26 2 -27 58 -27 65 0 82 -11 82 -52 0 -21 5 -28 20 -28 48 0 92 -42 75 -71 -4 -6 -13 -33 -20 -60 -13 -47 -12 -50 8 -61 33 -17 38 -29 32 -76 -5 -33 -2 -48 14 -68 25 -31 27 -67 6 -84 -8 -7 -15 -18 -15 -25 0 -7 -10 -19 -22 -27 -22 -15 -22 -15 -4 -71 18 -56 16 -102 -7 -138 -7 -12 -3 -28 18 -63 23 -40 31 -46 49 -41 12 4 35 9 51 12 17 3 39 12 50 19 45 32 57 18 67 -76 3 -27 24 -35 121 -45 40 -5 64 -13 75 -26 10 -12 29 -19 52 -19 20 0 46 -7 59 -16 20 -15 43 -16 172 -10 117 6 155 5 181 -7 94 -40 149 -40 157 -1 2 10 12 32 23 47 16 23 19 39 15 76 -6 46 -14 70 -63 179 -13 29 -24 59 -24 66 0 8 -12 23 -26 33 -30 22 -64 109 -64 163 0 19 11 56 25 82 32 61 31 77 -5 123 -26 33 -29 43 -23 74 5 20 8 62 8 93 0 52 -3 60 -37 95 -20 21 -46 61 -58 89 -13 31 -31 56 -45 62 -26 12 -42 64 -31 105 10 41 64 112 110 144 60 42 77 71 83 141 5 59 5 59 -25 70 -17 6 -55 29 -84 50 -39 30 -70 44 -118 53 -83 16 -127 64 -179 198 -12 29 -32 67 -45 84 -14 18 -27 43 -31 57 -5 20 -20 30 -78 52 -40 15 -99 30 -132 34 -67 8 -108 31 -130 74 -18 34 -20 122 -4 152 10 18 8 25 -11 40 -27 22 -28 22 -63 -5z' },
		{ id: 14, width: '182px', height: '184px', left: '665px', top: '95px', viewBox: '0 0 1820 1420', path: 'M202 1358 c-19 -19 -14 -58 10 -78 21 -16 21 -20 10 -69 -18 -77 -15 -96 18 -143 45 -65 48 -96 11 -142 -17 -21 -31 -49 -31 -61 0 -12 -7 -29 -17 -36 -23 -20 -44 -75 -38 -102 9 -36 -20 -152 -44 -176 -12 -12 -21 -25 -21 -29 0 -16 59 -127 82 -155 21 -26 26 -27 53 -16 17 6 44 13 60 15 42 4 195 71 223 96 16 16 22 33 22 64 0 39 2 43 30 49 22 5 39 1 64 -14 39 -25 69 -27 86 -6 16 19 30 19 30 1 0 -27 42 -65 103 -94 83 -39 117 -46 166 -31 32 9 50 10 81 0 43 -13 48 -22 25 -41 -8 -7 -15 -28 -15 -46 0 -28 5 -36 26 -44 35 -13 35 -13 68 15 16 14 47 30 70 36 22 6 60 21 85 33 l46 22 1 -66 c0 -56 5 -73 37 -127 20 -34 37 -64 37 -68 0 -4 14 -25 31 -46 36 -45 71 -52 91 -16 8 14 15 80 18 179 4 129 8 159 23 175 9 11 17 29 17 41 0 20 2 21 20 10 16 -10 24 -9 47 8 15 12 32 34 38 49 9 24 6 30 -21 54 -30 25 -31 29 -27 82 5 56 -3 74 -42 97 -13 7 -12 14 5 47 30 59 26 91 -12 115 -18 11 -41 20 -50 20 -10 0 -19 11 -23 28 -13 56 -29 67 -108 67 l-72 0 -14 45 c-7 25 -17 52 -21 60 -11 21 -98 16 -155 -10 l-45 -20 -61 47 -61 48 -91 4 c-76 3 -97 7 -126 27 -28 19 -49 24 -100 24 -56 0 -67 3 -97 30 -51 45 -78 47 -141 15 l-55 -28 -46 22 c-45 21 -150 51 -175 51 -7 0 -18 -5 -25 -12z m222 -673 c11 -8 28 -15 38 -15 12 0 18 -7 18 -21 0 -14 -5 -19 -14 -16 -8 3 -30 9 -49 12 -29 6 -33 10 -29 31 5 28 10 29 36 9z' },
		{ id: 15, width: '146px', height: '184px', left: '672px', top: '228px', viewBox: '0 0 1460 1840', path: 'M564 1477 c-29 -12 -62 -29 -75 -38 l-23 -16 22 -35 c23 -37 20 -61 -14 -131 -17 -34 -18 -70 -3 -134 8 -37 18 -53 42 -68 27 -18 32 -27 33 -60 0 -22 4 -49 8 -60 4 -11 12 -30 17 -43 5 -13 21 -30 37 -39 58 -33 79 -93 33 -93 -13 0 -27 -12 -36 -30 -8 -16 -25 -32 -38 -36 -12 -3 -31 -20 -42 -37 -22 -35 -60 -46 -96 -27 -29 16 -49 -2 -31 -30 18 -30 15 -46 -15 -70 -35 -27 -63 -74 -63 -105 0 -32 -35 -55 -85 -55 -39 0 -41 -2 -75 -64 l-34 -65 23 -25 c14 -15 33 -26 44 -26 10 0 41 -11 69 -25 60 -30 93 -31 133 -5 45 30 86 26 138 -14 34 -26 58 -35 98 -39 30 -3 68 -9 86 -12 26 -6 40 -1 77 24 74 51 94 116 61 194 -8 20 -12 48 -10 64 3 15 9 82 14 147 l9 120 -39 65 c-41 68 -47 102 -28 156 11 28 9 35 -10 54 -12 12 -24 35 -28 52 -3 18 -19 41 -40 56 -39 30 -93 104 -93 127 0 19 67 126 89 143 9 7 40 20 69 30 57 18 58 20 38 77 -13 37 -17 39 -102 67 -49 16 -93 28 -99 28 -5 -1 -33 -11 -61 -22z' },
		{ id: 16, width: '146px', height: '184px', left: '727px', top: '208px', viewBox: '0 0 1460 1840', path: 'M569 1430 c-55 -28 -64 -44 -48 -81 12 -29 11 -33 -11 -51 -29 -23 -70 -18 -113 13 -25 18 -31 19 -50 6 -55 -35 -106 -27 -152 23 -27 30 -73 53 -92 45 -14 -5 -13 -9 7 -29 12 -14 23 -36 24 -51 1 -18 15 -38 44 -61 23 -20 42 -42 42 -50 0 -8 16 -30 36 -48 39 -36 40 -47 16 -123 -9 -28 -6 -41 24 -103 38 -80 41 -110 19 -193 -14 -54 -14 -58 6 -92 21 -35 21 -37 4 -69 -18 -33 -18 -34 3 -61 16 -20 22 -42 22 -79 0 -49 -2 -52 -61 -107 -37 -35 -56 -60 -49 -64 6 -4 42 -4 80 0 l70 7 36 -41 c35 -38 41 -41 89 -41 29 0 69 7 88 15 44 18 91 19 104 3 6 -7 13 -25 17 -40 14 -60 44 -18 56 79 6 43 15 72 29 87 26 28 51 145 51 242 0 65 -3 80 -25 108 -24 32 -26 40 -28 185 l-2 151 -32 30 c-26 24 -33 40 -39 87 -3 32 -17 79 -30 105 -27 54 -29 82 -9 118 24 43 18 58 -31 80 -54 23 -48 23 -95 0z' },
		{ id: 17, width: '175px', height: '131px', left: '776px', top: '318px', viewBox: '0 0 1750 1310', path: 'M1116 1183 c-4 -5 -14 -23 -21 -40 -15 -35 -29 -42 -38 -20 -7 18 -69 47 -99 47 -29 0 -58 -28 -58 -57 0 -15 -12 -25 -46 -38 -27 -10 -70 -41 -106 -76 -32 -32 -74 -67 -91 -78 -18 -11 -38 -29 -45 -40 -8 -15 -23 -21 -46 -21 -30 0 -34 4 -45 40 -9 29 -20 44 -39 51 -24 9 -30 7 -62 -30 -26 -29 -50 -44 -92 -57 -59 -18 -91 -43 -102 -80 -10 -33 54 -100 104 -108 45 -7 50 -19 17 -41 -51 -33 -86 -39 -121 -20 -39 21 -86 14 -93 -14 -3 -10 -16 -25 -30 -32 -53 -28 -68 -114 -30 -170 26 -40 136 -115 189 -129 47 -13 124 3 155 32 20 18 30 20 92 14 45 -5 71 -3 76 3 3 6 17 11 30 11 22 0 24 -2 13 -24 -9 -21 -6 -32 16 -70 14 -24 26 -58 26 -74 0 -36 15 -50 77 -67 26 -8 68 -21 93 -29 194 -65 258 -67 295 -9 20 32 95 73 132 73 11 0 26 -7 33 -15 18 -22 52 -15 66 13 6 13 25 38 42 55 17 18 33 48 38 70 4 22 13 41 23 43 9 3 35 14 59 25 23 10 63 19 87 19 43 0 45 2 75 53 40 69 39 92 -7 132 -37 32 -38 35 -36 91 3 52 0 62 -29 99 -50 62 -124 113 -168 115 -47 2 -66 62 -30 95 26 24 25 57 -2 82 -34 30 -99 69 -131 77 -22 5 -26 11 -22 29 8 34 -7 47 -71 62 -71 17 -69 17 -78 8z' },
		{ id: 18, width: '120px', height: '186px', left: '893px', top: '98px', viewBox: '0 0 1200 1860', path: 'M270 1701 c-5 -11 -10 -38 -10 -61 0 -33 -6 -47 -33 -73 -48 -46 -105 -136 -112 -178 -5 -29 -2 -41 19 -66 22 -26 87 -152 124 -241 9 -21 11 -47 7 -73 -6 -34 -3 -47 20 -81 24 -36 26 -47 21 -102 -19 -213 -19 -229 -2 -238 24 -14 56 -83 56 -122 0 -27 6 -40 24 -52 29 -18 42 -55 50 -142 4 -46 2 -71 -9 -92 -20 -38 -19 -86 1 -94 9 -3 173 -6 365 -6 l349 0 0 775 c0 426 -2 775 -4 775 -2 0 -25 -9 -51 -20 -58 -25 -58 -25 -92 4 -24 20 -43 24 -145 31 -83 5 -126 3 -150 -5 -29 -11 -39 -10 -67 4 -17 9 -35 24 -38 32 -4 11 -28 14 -114 14 -75 0 -121 5 -146 15 -46 19 -50 19 -63 -4z' },
		{ id: 19, width: '146px', height: '184px', left: '866px', top: '257px', viewBox: '0 0 1460 1840', path: 'M683 1081 c-39 -36 -47 -39 -121 -45 -68 -6 -83 -11 -105 -34 -14 -15 -31 -46 -38 -70 -8 -28 -24 -51 -48 -69 -20 -15 -37 -31 -39 -35 -6 -13 -35 -9 -56 7 -24 18 -40 19 -58 3 -7 -7 -30 -22 -51 -32 -21 -11 -43 -31 -50 -45 -7 -14 -21 -27 -32 -29 -41 -8 -57 -34 -52 -85 2 -26 11 -55 19 -65 16 -19 38 -88 38 -119 0 -19 72 -131 94 -145 6 -4 45 -8 88 -8 73 0 77 -1 102 -30 26 -32 81 -60 114 -60 11 0 40 -20 64 -45 l45 -45 98 0 c95 0 98 -1 133 -31 32 -28 39 -30 86 -25 28 3 106 9 174 12 121 6 123 6 163 -20 44 -30 60 -28 119 9 68 43 65 27 63 363 -2 314 -4 332 -44 332 -26 0 -56 36 -62 76 -3 20 -11 42 -18 50 -15 18 -61 18 -123 -1 -79 -24 -117 -20 -167 19 -24 18 -63 43 -85 54 -43 22 -54 38 -54 76 0 34 -31 56 -78 56 -22 0 -44 5 -47 10 -11 18 -29 10 -72 -29z' },
		{ id: 20, width: '118px', height: '254px', left: '999px', top: '100px', viewBox: '0 0 1180 2540', path: 'M389 2419 c-28 -22 -85 -38 -135 -39 -26 0 -34 -6 -44 -31 -8 -19 -24 -35 -43 -41 -59 -21 -57 23 -57 -1151 l0 -1074 41 -6 c22 -3 120 -3 217 0 l177 5 130 64 c86 41 161 70 220 84 50 11 105 25 123 31 l32 11 -2 696 -3 697 -83 40 c-80 39 -83 42 -102 93 -11 29 -20 73 -20 98 0 38 -5 50 -35 80 -28 27 -35 43 -35 73 0 66 19 140 45 179 29 43 32 82 8 120 -41 66 -87 84 -160 63 -25 -7 -46 -5 -88 10 -72 25 -152 24 -186 -2z' },
		{ id: 21, width: '146px', height: '184px', left: '1114px', top: '320px', viewBox: '0 0 1460 1840', path: 'M140 1309 c0 -6 8 -24 17 -40 12 -20 15 -34 8 -43 -41 -55 -46 -67 -40 -83 4 -10 44 -53 89 -95 l82 -77 73 -7 c73 -7 73 -7 107 -53 19 -25 39 -61 46 -78 8 -22 19 -33 33 -33 58 -1 142 -137 152 -248 3 -37 16 -92 28 -122 12 -30 25 -86 29 -125 4 -38 14 -90 22 -114 8 -24 12 -52 9 -62 -10 -31 23 -23 40 10 9 18 41 44 82 68 84 48 90 66 30 92 -60 26 -103 94 -110 177 -3 36 -15 80 -30 110 -27 53 -60 153 -82 249 -8 33 -19 80 -26 105 -6 25 -13 50 -15 56 -1 7 -36 17 -76 24 -105 17 -106 17 -129 62 -19 36 -23 40 -50 34 -28 -5 -105 23 -119 45 -3 4 -21 9 -40 11 -33 3 -36 7 -53 58 -10 30 -26 63 -34 73 -18 19 -43 23 -43 6z' },
		{ id: 22, width: '182px', height: '212px', left: '1085px', top: '100px', viewBox: '0 0 1820 2120', path: 'M1073 1874 c4 -145 29 -243 80 -317 42 -61 44 -77 14 -132 -37 -67 -60 -53 -125 74 l-17 33 -85 -6 c-80 -7 -87 -6 -105 14 -11 12 -27 43 -36 68 l-16 47 -204 3 c-117 2 -239 -2 -287 -9 l-83 -11 6 -102 c5 -71 3 -110 -6 -131 -9 -23 -11 -159 -10 -575 l2 -545 37 -37 c32 -34 41 -38 87 -38 27 0 70 -7 94 -16 31 -11 85 -15 178 -16 123 0 135 -2 148 -21 13 -19 18 -20 69 -8 45 10 63 10 91 0 29 -11 41 -11 68 1 19 8 77 15 145 18 94 3 123 0 172 -17 l59 -20 47 21 c43 19 60 20 159 15 61 -3 123 -11 138 -16 23 -9 29 -7 48 17 17 22 20 36 16 78 -3 28 -16 71 -28 95 -20 37 -25 66 -30 174 -5 105 -12 145 -34 207 l-28 77 23 71 c25 79 24 141 -6 203 -14 29 -23 37 -45 37 -14 0 -32 -7 -39 -15 -20 -24 -55 -17 -89 17 -35 36 -37 50 -16 101 27 64 21 78 -47 117 -94 53 -166 135 -211 238 -37 86 -37 88 -26 150 11 61 11 63 -17 103 -42 60 -51 79 -61 123 -4 22 -14 41 -21 44 -11 3 -12 -20 -9 -114z' },
		{ id: 23, width: '146px', height: '184px', left: '1063px', top: '250px', viewBox: '0 0 1460 1840', path: 'M630 1336 c-14 -8 -32 -26 -40 -40 -18 -34 -1 -91 43 -143 35 -43 74 -110 67 -117 -3 -2 -26 -1 -52 3 -42 7 -50 5 -69 -15 -12 -13 -19 -30 -15 -39 4 -12 -9 -22 -51 -41 -64 -28 -73 -37 -73 -76 0 -38 -75 -164 -103 -172 -53 -14 -111 -6 -149 20 -37 26 -39 26 -58 9 -11 -10 -20 -29 -20 -43 0 -14 -5 -42 -12 -63 -14 -48 2 -156 29 -196 12 -17 24 -63 31 -118 11 -79 16 -93 42 -117 22 -21 41 -28 69 -28 31 0 46 -7 74 -35 l34 -34 334 6 c184 3 338 10 344 15 15 14 34 109 26 132 -4 11 -38 51 -74 90 -120 128 -187 203 -187 208 0 3 25 13 56 23 69 21 119 52 133 82 7 15 6 49 -4 115 -8 51 -15 113 -15 138 0 36 -8 57 -41 105 -22 33 -54 88 -70 123 -15 35 -49 86 -74 114 -25 27 -45 54 -45 58 0 12 -42 37 -75 43 -18 4 -40 1 -55 -7z' },
		{ id: 24, width: '146px', height: '184px', left: '1050px', top: '310px', viewBox: '0 0 1460 1840', path: 'M593 1262 c-21 -13 -34 -65 -28 -105 6 -31 3 -43 -13 -60 -25 -26 -42 -69 -42 -103 0 -28 -2 -28 -59 -8 -39 13 -46 13 -67 -1 -13 -8 -24 -24 -24 -35 0 -19 -3 -18 -49 7 -46 26 -52 27 -95 15 -26 -6 -59 -12 -74 -12 -38 0 -90 -35 -103 -68 -10 -26 -8 -67 7 -126 5 -21 1 -40 -16 -71 -37 -68 -17 -104 58 -105 13 0 40 -11 60 -25 20 -14 42 -25 48 -25 6 0 23 -11 38 -25 l27 -25 -26 0 c-14 0 -39 -7 -55 -15 -36 -19 -38 -43 -11 -129 20 -65 38 -81 81 -71 17 4 30 3 30 -2 0 -5 14 -31 31 -57 24 -36 30 -54 26 -76 -7 -34 10 -55 60 -76 73 -31 166 0 210 69 30 47 66 154 59 173 -5 14 15 24 50 24 17 0 32 12 52 40 26 38 29 39 83 40 77 0 90 16 61 74 -12 24 -22 48 -22 54 0 29 -36 82 -67 99 -20 11 -36 28 -39 43 -3 14 -18 53 -35 87 -16 34 -29 68 -29 77 0 9 -16 34 -37 56 -35 40 -36 41 -16 55 26 18 41 73 47 173 5 92 -1 103 -61 128 -37 16 -43 17 -60 6z' },
		{ id: 25, width: '146px', height: '184px', left: '1040px', top: '400px', viewBox: '0 0 1460 1840', path: 'M458 738 c-14 -14 -38 -23 -70 -26 -37 -3 -55 -11 -76 -33 -19 -20 -37 -29 -59 -29 -17 0 -33 -5 -35 -10 -2 -6 -21 -17 -43 -24 -24 -8 -49 -26 -62 -46 -24 -34 -30 -84 -13 -95 5 -3 10 -17 10 -31 0 -14 5 -35 11 -46 8 -16 8 -31 -1 -62 -15 -47 -16 -222 -1 -239 5 -7 11 -25 13 -41 1 -16 11 -34 21 -40 15 -9 23 -6 45 22 25 29 32 32 82 32 81 0 116 14 163 63 28 30 54 46 78 51 66 12 101 69 61 98 -34 25 -65 79 -53 91 6 6 11 25 11 42 1 16 7 41 15 55 17 29 19 88 5 124 -6 16 -6 27 0 31 13 8 13 91 0 116 -15 27 -73 26 -102 -3z' },
		{ id: 26, width: '146px', height: '184px', left: '1040px', top: '400px', viewBox: '0 0 1460 1840', path: '' },
		{ id: 27, width: '146px', height: '184px', left: '1040px', top: '400px', viewBox: '0 0 1460 1840', path: '' },
		{ id: 28, width: '146px', height: '184px', left: '947px', top: '455px', viewBox: '0 0 1460 1840', path: 'M709 1460 c-49 -26 -55 -35 -72 -115 -20 -97 -74 -201 -145 -277 -28 -29 -38 -51 -48 -105 -7 -37 -13 -91 -14 -120 0 -28 -5 -64 -12 -80 -6 -15 -12 -56 -12 -90 -1 -53 -5 -67 -34 -105 -34 -45 -43 -63 -59 -113 -9 -32 -24 -35 -89 -20 l-31 7 -13 -84 c-7 -45 -14 -112 -14 -146 -1 -55 2 -66 23 -83 26 -21 81 -25 112 -8 16 8 25 7 42 -6 106 -77 98 -75 133 -40 14 14 36 32 49 41 31 20 44 125 20 169 -15 29 -14 31 10 51 14 11 29 33 33 49 12 42 33 52 84 37 118 -36 168 -44 183 -32 21 17 19 64 -5 110 -30 58 -26 125 10 192 16 30 39 63 50 73 17 16 20 31 20 110 l0 92 -42 56 c-53 68 -76 85 -85 60 -3 -10 -19 -31 -35 -48 -16 -16 -42 -46 -58 -66 -17 -20 -44 -42 -61 -50 -29 -12 -33 -11 -51 10 -26 33 -33 70 -19 105 7 17 21 60 32 95 14 49 27 71 54 94 45 37 75 95 75 145 0 22 7 56 15 76 18 42 9 45 -46 16z' },
		{ id: 29, width: '146px', height: '184px', left: '892px', top: '340px', viewBox: '0 0 1460 1840', path: 'M591 1445 c-23 -14 -48 -25 -55 -25 -6 -1 -29 -9 -51 -20 -22 -11 -45 -19 -51 -20 -27 -1 -52 -46 -56 -104 -5 -54 -8 -63 -43 -91 l-37 -32 7 -72 c5 -56 13 -79 32 -102 33 -39 20 -56 -30 -40 -18 6 -42 9 -51 5 -20 -7 -86 -107 -86 -129 0 -8 -12 -22 -26 -32 -23 -15 -26 -22 -21 -61 7 -61 52 -115 103 -123 21 -3 60 -15 85 -26 61 -28 77 -64 60 -135 -10 -44 -9 -53 5 -69 9 -10 25 -21 35 -24 11 -4 17 -10 14 -15 -9 -15 42 -118 65 -130 14 -8 26 -8 40 0 24 13 40 5 40 -19 0 -25 30 -50 74 -62 44 -12 73 -5 81 20 3 10 16 23 30 29 14 6 28 24 31 39 4 15 16 42 26 58 10 17 18 40 18 52 0 17 9 25 41 34 47 14 123 78 145 121 9 17 20 75 25 130 9 94 8 102 -12 135 -21 33 -21 36 -5 69 24 52 20 114 -11 174 -18 36 -26 64 -24 92 1 26 -5 52 -19 74 -24 42 -25 67 -5 84 23 19 18 39 -22 79 -59 59 -83 71 -138 71 -65 0 -95 9 -95 27 0 18 -45 63 -62 63 -7 0 -33 -11 -57 -25z' },
		{ id: 30, width: '146px', height: '184px', left: '980px', top: '370px', viewBox: '0 0 1460 1840', path: 'M274 1288 c-4 -13 -19 -39 -34 -58 -36 -46 -42 -94 -19 -148 11 -24 19 -49 19 -56 0 -7 -36 -51 -80 -97 -44 -46 -80 -89 -80 -95 0 -6 10 -19 21 -30 19 -17 21 -27 16 -90 -5 -71 -5 -72 34 -119 43 -52 46 -65 25 -98 -8 -12 -18 -41 -22 -64 -5 -34 -3 -44 9 -49 24 -9 28 -32 12 -64 -21 -40 -10 -170 14 -170 61 1 142 21 175 44 47 32 96 34 183 7 72 -22 123 -51 141 -80 12 -21 65 -30 76 -12 3 4 -6 23 -19 41 -13 18 -29 58 -35 89 -6 31 -16 68 -21 82 -6 15 -15 100 -20 190 -20 356 -28 409 -64 423 -9 3 -21 19 -26 35 -7 19 -27 39 -52 55 -23 13 -57 45 -76 71 -32 44 -33 50 -28 105 7 62 2 70 -47 70 -13 0 -35 9 -49 20 -32 26 -44 25 -53 -2z' },
		{ id: 31, width: '146px', height: '184px', left: '1010px', top: '450px', viewBox: '0 0 1460 1840', path: 'M273 609 c-18 -5 -43 -23 -55 -39 -12 -17 -27 -30 -34 -30 -22 0 -70 -48 -94 -93 l-24 -45 42 -70 c32 -53 50 -73 74 -81 18 -6 56 -36 84 -66 29 -30 60 -55 68 -55 9 0 18 -13 21 -34 12 -59 78 -73 125 -26 11 11 27 20 36 20 9 0 46 13 82 29 37 16 86 35 108 41 23 7 54 23 70 35 l28 22 -22 53 c-12 29 -22 61 -22 72 0 24 -38 82 -88 136 -42 43 -110 81 -148 82 -12 0 -38 14 -59 30 -33 26 -45 30 -99 29 -33 0 -76 -5 -93 -10z' },
		{ id: 32, width: '146px', height: '184px', left: '1072px', top: '530px', viewBox: '0 0 1460 1840', path: 'M268 606 c-42 -34 -58 -56 -75 -103 -13 -32 -23 -71 -23 -87 0 -15 -11 -41 -25 -58 -14 -17 -25 -42 -25 -59 0 -16 -7 -40 -16 -53 -14 -22 -14 -32 -1 -94 17 -83 20 -88 56 -107 71 -36 145 51 110 128 -10 21 -5 30 45 82 102 107 144 257 95 340 -40 68 -69 70 -141 11z' },
		{ id: 33, width: '146px', height: '184px', left: '1037px', top: '580px', viewBox: '0 0 1460 1840', path: 'M393 576 c-35 -8 -58 -19 -72 -38 -14 -18 -44 -33 -93 -48 -88 -27 -128 -46 -128 -63 0 -7 -9 -30 -20 -52 -32 -63 -20 -128 26 -139 13 -4 35 -24 50 -45 17 -26 39 -44 68 -55 24 -9 61 -32 84 -51 22 -19 42 -35 45 -35 3 0 19 13 36 30 31 28 32 30 15 55 -12 18 -15 37 -11 66 6 48 29 76 76 96 31 13 33 17 28 50 -4 19 -15 42 -27 50 -24 17 -27 61 -5 89 18 23 19 76 3 92 -7 7 -14 11 -17 11 -4 -1 -29 -7 -58 -13z' },
		{ id: 34, width: '146px', height: '184px', left: '974px', top: '593px', viewBox: '0 0 1460 1840', path: 'M478 748 c-19 -18 -46 -43 -59 -53 -39 -31 -119 -151 -119 -178 0 -13 -11 -45 -25 -71 -14 -26 -25 -58 -25 -72 0 -14 -18 -64 -41 -110 -32 -68 -46 -88 -69 -96 -31 -10 -49 -43 -32 -60 7 -7 21 -7 44 0 18 6 51 14 73 17 34 6 45 14 70 53 23 36 41 51 79 65 27 10 62 27 78 39 27 19 29 24 24 63 -6 39 -5 44 28 69 19 14 40 26 46 26 21 0 21 28 1 61 -25 41 -29 130 -7 149 8 6 42 18 76 26 60 14 62 14 105 -11 53 -31 85 -33 152 -9 55 20 62 29 41 56 -22 27 -79 40 -213 48 -71 5 -144 11 -162 15 -27 6 -36 3 -65 -27z' },
		{ id: 35, width: '146px', height: '184px', left: '718px', top: '472px', viewBox: '0 0 1460 1840', path: 'M568 1018 c-9 -7 -26 -53 -38 -103 -28 -112 -84 -233 -114 -245 -14 -5 -34 -34 -55 -79 -29 -64 -36 -72 -72 -83 -22 -6 -53 -26 -68 -44 -16 -17 -40 -40 -54 -49 -16 -10 -32 -36 -43 -68 -17 -51 -17 -51 7 -70 13 -11 56 -35 94 -54 39 -20 100 -55 136 -79 94 -61 107 -63 158 -20 30 26 53 36 76 36 52 0 82 16 93 49 15 44 90 141 123 160 16 9 34 29 40 44 23 56 85 75 117 36 31 -38 67 -69 80 -69 7 0 15 14 19 31 4 21 16 37 36 48 33 17 97 80 97 95 0 5 -7 14 -15 20 -8 6 -19 31 -23 56 -6 29 -25 68 -55 109 -26 35 -47 67 -47 71 0 5 -28 24 -62 42 -35 19 -100 58 -145 87 -69 45 -93 55 -145 61 -35 4 -76 12 -91 18 -34 14 -30 15 -49 0z' },
		{ id: 36, width: '146px', height: '174px', left: '678px', top: '400px', viewBox: '0 0 1460 1840', path: 'M717 494 c-3 -4 -55 -10 -114 -15 -59 -4 -123 -11 -141 -14 -22 -5 -40 -2 -57 9 -34 23 -96 21 -123 -4 -12 -11 -32 -20 -46 -20 -37 0 -71 -18 -88 -48 -9 -15 -26 -38 -37 -51 -46 -53 -63 -133 -46 -218 6 -25 50 -43 106 -43 21 0 41 -4 44 -10 3 -5 37 -10 74 -10 37 0 72 -5 78 -11 7 -7 36 -10 75 -7 53 4 73 11 127 46 73 48 97 51 158 21 74 -36 128 -4 177 103 29 63 36 171 14 200 -13 15 -159 78 -183 78 -6 0 -14 -3 -18 -6z' },
		{ id: 37, width: '146px', height: '184px', left: '698px', top: '430px', viewBox: '0 0 1460 1840', path: 'M245 752 c-11 -9 -26 -30 -33 -45 -6 -15 -24 -33 -40 -38 -37 -14 -99 -98 -113 -155 l-12 -46 39 -34 c21 -18 52 -36 67 -39 16 -4 31 -14 35 -23 3 -9 25 -44 48 -77 29 -42 43 -75 48 -109 5 -39 14 -58 44 -88 l37 -38 100 1 c55 1 128 -4 163 -12 77 -16 111 -6 125 36 6 17 23 51 39 76 32 53 35 75 12 107 -19 27 -11 57 24 94 14 15 28 46 32 70 5 24 13 69 20 100 10 44 10 61 1 72 -13 15 -115 66 -133 66 -6 0 -32 -13 -57 -29 -25 -16 -61 -32 -80 -36 -29 -6 -37 -3 -70 28 -46 46 -213 137 -249 137 -15 -1 -36 -8 -47 -18z' },
		{ id: 38, width: '146px', height: '184px', left: '758px', top: '400px', viewBox: '0 0 1460 1840', path: 'M790 1083 c-36 -8 -74 -23 -85 -33 -34 -29 -43 -31 -82 -20 -31 9 -45 8 -73 -5 -66 -30 -125 -71 -128 -89 -5 -25 -90 -106 -111 -106 -22 0 -41 -19 -41 -41 0 -29 -50 -113 -86 -145 l-36 -31 18 -56 17 -56 -26 -39 c-24 -34 -27 -48 -27 -120 0 -87 4 -93 45 -66 20 13 31 14 56 5 40 -14 39 -14 39 3 0 43 146 156 202 156 45 0 67 -114 34 -177 -9 -18 -21 -33 -26 -33 -23 0 -7 -22 25 -36 37 -15 44 -34 20 -54 -17 -14 -19 -29 -6 -49 8 -12 16 -10 48 12 49 34 73 35 73 4 0 -17 10 -28 35 -40 49 -23 57 -22 105 18 23 19 48 35 55 35 7 0 38 26 69 58 31 33 79 69 106 82 28 13 50 26 50 30 0 4 -11 17 -25 30 -14 13 -25 29 -25 35 0 16 -36 47 -94 80 -56 32 -83 71 -92 133 -5 36 -1 53 26 108 29 59 31 70 22 105 -9 34 -7 43 8 57 10 9 22 30 26 46 4 19 17 32 35 39 38 15 58 61 35 85 -8 10 -21 32 -27 49 -16 46 -49 52 -159 26z' },
		{ id: 39, width: '146px', height: '184px', left: '831px', top: '420px', viewBox: '0 0 1460 1840', path: 'M486 891 c-26 -49 -63 -57 -175 -36 -120 22 -137 18 -94 -21 18 -16 33 -34 33 -40 0 -34 -51 -121 -84 -142 -39 -24 -45 -42 -21 -62 21 -18 19 -47 -6 -68 -11 -9 -27 -29 -35 -44 -14 -28 -19 -131 -8 -186 6 -28 8 -30 44 -25 32 4 42 1 59 -18 11 -13 38 -43 60 -67 l39 -43 80 7 c55 5 81 3 86 -5 12 -18 26 -13 36 14 11 28 44 34 57 11 4 -8 26 -16 48 -18 32 -2 41 -7 43 -25 4 -24 22 -33 74 -35 50 -2 58 7 58 62 0 28 5 69 12 93 11 41 9 48 -26 121 -25 52 -57 97 -93 134 -59 59 -61 66 -38 162 6 22 0 30 -31 50 -58 38 -63 54 -31 88 17 18 27 39 27 58 0 25 -6 33 -35 47 -49 23 -62 21 -79 -12z' },
		{ id: 40, width: '146px', height: '184px', left: '665px', top: '460px', viewBox: '0 0 1460 1840', path: 'M285 709 c-214 -11 -226 -14 -244 -65 -11 -32 -11 -62 -2 -164 15 -166 14 -222 -4 -256 -18 -35 -19 -56 -2 -112 21 -68 24 -69 158 -26 l76 25 44 -21 c55 -24 101 -25 127 -2 11 9 33 53 48 97 15 44 35 90 44 102 10 13 21 39 25 60 3 20 29 81 56 135 27 53 49 104 49 112 0 21 -58 104 -80 116 -20 11 -44 11 -295 -1z' },
		{ id: 41, width: '146px', height: '184px', left: '603px', top: '453px', viewBox: '0 0 1460 1840', path: 'M685 804 c-16 -8 -37 -22 -46 -30 -8 -8 -28 -14 -43 -14 -33 0 -94 -30 -121 -60 -32 -35 -90 -60 -142 -60 -26 0 -57 -7 -67 -15 -11 -8 -29 -15 -40 -15 -35 0 -129 -73 -155 -119 -21 -38 -22 -48 -13 -75 6 -17 15 -72 18 -121 8 -108 32 -168 82 -212 36 -32 61 -36 87 -12 5 5 28 9 52 9 36 0 49 6 87 43 46 43 110 87 127 87 5 0 9 -10 9 -23 0 -13 14 -45 31 -71 28 -45 32 -48 64 -43 50 8 103 36 110 58 4 11 1 44 -5 74 -9 45 -9 58 3 76 12 17 14 47 10 157 -3 80 -1 154 5 177 50 192 48 176 27 191 -24 18 -43 18 -80 -2z' },
		{ id: 42, width: '146px', height: '184px', left: '585px', top: '580px', viewBox: '0 0 1460 1840', path: 'M1016 1248 c-11 -6 -47 -8 -88 -6 -57 5 -73 2 -92 -13 -27 -21 -56 -96 -56 -144 0 -51 -24 -75 -76 -75 -30 0 -46 5 -50 15 -13 34 -94 8 -94 -30 0 -24 -41 -42 -120 -53 -62 -9 -78 -15 -95 -37 -11 -14 -50 -61 -88 -105 -57 -68 -67 -84 -67 -117 0 -44 36 -154 53 -165 18 -11 96 -10 118 2 10 6 48 13 84 17 61 6 65 5 76 -19 9 -20 8 -31 -5 -56 -9 -17 -16 -37 -16 -45 0 -8 -11 -31 -25 -51 l-25 -37 27 -57 c27 -54 30 -58 78 -68 57 -12 86 -26 105 -49 7 -8 32 -24 55 -34 24 -11 51 -31 60 -45 25 -38 42 -32 71 26 14 28 40 65 57 83 48 47 130 139 150 168 10 16 34 31 60 38 23 6 64 21 91 32 33 15 70 22 110 22 l61 0 9 48 c8 41 6 56 -16 110 l-26 62 -68 5 c-63 5 -125 27 -138 49 -3 5 0 26 8 47 12 36 11 43 -13 92 l-26 53 33 62 c18 34 32 69 32 77 0 8 -20 27 -44 42 -34 21 -47 36 -60 74 -9 26 -16 58 -16 71 0 26 -6 28 -34 11z' },
		{ id: 43, width: '146px', height: '184px', left: '468px', top: '480px', viewBox: '0 0 1460 1840', path: 'M541 1035 c-11 -14 -23 -39 -26 -55 -6 -27 -11 -30 -44 -30 -50 0 -66 -20 -82 -99 -16 -82 -66 -141 -121 -141 -54 0 -59 -13 -50 -126 4 -54 3 -115 -2 -134 -9 -37 5 -67 86 -188 15 -23 28 -46 28 -51 0 -4 12 -22 28 -38 15 -17 47 -53 70 -82 35 -41 48 -50 64 -45 11 3 62 9 112 13 l91 6 33 55 c24 41 47 63 90 88 31 19 80 57 107 86 28 29 59 59 70 67 32 23 120 130 143 177 30 58 31 168 3 204 -20 24 -64 42 -132 53 -41 6 -239 101 -239 115 0 20 -82 128 -105 138 -46 21 -101 15 -124 -13z' },
		{ id: 44, width: '146px', height: '184px', left: '518px', top: '557px', viewBox: '0 0 1460 1840', path: 'M1026 761 l-110 -6 -7 -29 c-12 -45 -37 -65 -91 -72 -53 -7 -80 -27 -110 -83 -16 -29 -21 -31 -74 -31 -44 0 -64 5 -88 23 -17 13 -60 31 -95 41 -56 16 -74 16 -143 6 -59 -9 -81 -10 -92 -1 -34 29 -124 7 -112 -26 3 -8 -1 -25 -10 -39 -17 -25 -17 -27 4 -205 4 -36 13 -73 19 -81 7 -8 37 -21 68 -28 38 -9 57 -19 61 -32 9 -28 60 -84 101 -109 19 -12 51 -37 72 -56 29 -27 43 -33 70 -31 31 3 39 10 68 60 44 76 69 83 119 34 43 -42 49 -43 129 -16 131 42 139 43 173 26 17 -9 42 -16 56 -16 14 0 36 -5 50 -11 37 -17 101 26 115 78 14 48 14 150 1 158 -6 4 -7 13 -1 23 16 33 20 166 5 187 -25 33 -18 97 16 143 50 69 36 103 -39 100 -26 -1 -95 -4 -155 -7z' },
		{ id: 45, width: '146px', height: '184px', left: '559px', top: '511px', viewBox: '0 0 1460 1840', path: 'M704 856 c-20 -31 -21 -44 -16 -149 5 -113 4 -115 -19 -130 -20 -13 -39 -14 -109 -8 -47 5 -96 13 -108 18 -28 11 -114 -2 -154 -23 -14 -8 -35 -14 -46 -14 -26 0 -52 36 -52 72 0 20 -5 28 -17 28 -27 0 -74 -35 -105 -76 -22 -30 -25 -39 -15 -55 11 -18 85 -59 106 -59 21 0 41 -34 41 -69 0 -27 11 -55 39 -98 36 -55 50 -66 192 -151 144 -87 157 -92 209 -92 31 0 61 5 67 11 8 8 17 8 31 0 30 -16 36 -14 83 25 23 19 58 42 78 50 69 29 182 106 192 131 5 13 9 59 9 101 0 68 -3 80 -24 100 -14 12 -32 43 -42 68 -15 39 -15 52 -5 97 12 48 11 55 -11 97 -20 37 -37 52 -93 82 -38 20 -71 42 -74 50 -7 22 -24 28 -81 27 -51 0 -56 -2 -76 -33z' },
		{ id: 46, width: '146px', height: '184px', left: '660px', top: '513px', viewBox: '0 0 1460 1840', path: 'M387 1082 c-10 -10 -17 -24 -17 -31 0 -9 -12 -10 -44 -6 -42 7 -44 6 -78 -37 -19 -23 -46 -62 -60 -84 -15 -23 -45 -55 -67 -70 -30 -21 -44 -40 -52 -69 -6 -22 -17 -52 -25 -67 -24 -46 -44 -120 -44 -169 0 -60 27 -137 50 -144 14 -5 20 -20 25 -71 4 -36 5 -82 1 -104 -5 -34 -2 -44 35 -90 l40 -51 181 1 c179 2 180 2 207 -23 29 -28 83 -57 104 -57 29 0 48 28 67 97 11 40 20 80 20 89 0 9 9 27 20 41 29 38 26 84 -9 117 -28 27 -36 53 -54 181 -3 17 -15 55 -27 85 -12 30 -29 75 -38 100 -8 25 -21 60 -29 79 -14 35 -11 43 22 54 16 6 23 148 9 179 -26 52 -59 68 -144 68 -62 0 -80 -4 -93 -18z' },
		{ id: 47, width: '146px', height: '184px', left: '710px', top: '543px', viewBox: '0 0 1460 1840', path: 'M431 1106 c-19 -20 -23 -36 -23 -97 -1 -83 5 -145 17 -173 8 -17 5 -19 -26 -13 -19 3 -41 8 -50 12 -9 3 -30 -6 -54 -25 -21 -16 -45 -30 -54 -30 -9 0 -26 -10 -37 -22 -12 -13 -39 -41 -60 -63 -52 -54 -94 -111 -94 -127 0 -8 7 -23 15 -34 8 -10 15 -40 15 -65 0 -34 11 -67 40 -124 22 -43 45 -84 50 -91 7 -7 8 -42 4 -91 -7 -88 -2 -99 71 -144 48 -30 73 -25 91 19 38 89 53 109 126 170 65 54 79 72 93 115 24 73 39 87 94 87 25 -1 57 -7 71 -15 14 -8 35 -14 48 -15 12 0 41 -9 64 -21 81 -41 120 20 80 124 -12 28 -26 70 -32 92 -5 22 -21 58 -35 80 -13 22 -29 51 -36 65 -6 14 -18 41 -27 60 -16 33 -70 91 -191 205 -29 28 -62 68 -73 90 -32 62 -51 69 -87 31z' },
		{ id: 48, width: '146px', height: '184px', left: '654px', top: '608px', viewBox: '0 0 1460 1840', path: 'M201 1319 c-13 -5 -39 -17 -57 -25 l-34 -16 0 -87 c0 -92 8 -111 46 -111 30 0 42 -18 47 -70 5 -55 16 -59 99 -30 36 12 72 19 86 15 22 -5 24 -10 20 -50 -4 -35 -1 -48 13 -61 10 -9 21 -25 24 -35 4 -11 20 -26 36 -34 34 -18 37 -42 9 -78 -29 -36 -25 -82 12 -146 21 -37 34 -75 38 -111 l5 -55 54 -5 c57 -6 81 -25 81 -65 0 -12 9 -30 21 -41 41 -37 43 -52 14 -110 -18 -35 -24 -60 -20 -75 7 -20 12 -21 64 -16 32 3 72 14 94 27 37 22 40 22 73 6 41 -19 90 -21 97 -3 2 6 -2 27 -9 46 -9 21 -14 74 -14 145 l0 111 -36 50 c-66 92 -77 122 -69 184 4 31 6 86 5 122 -1 45 5 82 19 117 20 51 20 52 1 62 -21 11 -189 14 -206 2 -6 -4 -14 -19 -18 -34 -8 -34 -41 -54 -61 -38 -8 6 -16 43 -20 88 -11 113 -23 136 -83 157 -36 13 -68 36 -108 78 -83 85 -155 113 -223 86z' },
		{ id: 49, width: '146px', height: '184px', left: '633px', top: '733px', viewBox: '0 0 1460 1840', path: 'M179 988 c-8 -13 -21 -39 -29 -58 -8 -19 -27 -60 -43 -90 -26 -47 -30 -66 -30 -129 1 -84 16 -107 65 -97 26 5 26 4 32 -57 3 -34 9 -105 12 -157 5 -77 10 -99 26 -117 14 -15 23 -44 29 -90 15 -138 18 -142 102 -162 100 -23 121 -15 173 71 21 35 52 80 71 101 18 20 33 41 33 46 0 9 38 26 83 35 16 4 39 23 57 48 27 37 30 48 30 119 0 43 5 81 10 84 14 9 12 61 -3 77 -15 15 -36 52 -66 118 -12 25 -47 73 -79 107 -31 35 -67 76 -79 91 -36 47 -114 70 -255 77 -121 6 -123 6 -139 -17z' },
		{ id: 50, width: '161px', height: '199px', left: '298px', top: '538px', viewBox: '0 0 1610 1990', path: 'M793 1888 c-90 -81 -113 -106 -113 -126 0 -12 23 -47 50 -78 53 -61 63 -100 35 -137 -7 -11 -17 -36 -20 -58 -7 -41 -43 -79 -75 -79 -31 0 -43 -26 -36 -77 3 -27 9 -78 12 -114 l6 -67 -30 -7 c-40 -8 -47 -19 -62 -90 -7 -33 -18 -65 -24 -72 -6 -6 -36 -20 -66 -30 -51 -17 -57 -22 -80 -71 -22 -49 -26 -53 -52 -48 -15 3 -45 17 -66 31 -34 23 -43 24 -66 14 -14 -7 -26 -16 -26 -20 0 -5 -14 -16 -31 -24 -57 -30 -69 -50 -69 -114 0 -75 11 -104 56 -146 38 -36 53 -79 54 -149 0 -22 8 -72 17 -113 16 -67 19 -74 49 -83 39 -13 76 -5 100 21 9 10 30 19 46 19 26 0 28 -2 28 -44 0 -65 17 -102 54 -120 37 -17 110 -35 145 -36 24 0 24 0 17 85 -4 53 -2 85 4 85 5 0 24 -6 42 -14 63 -27 116 -39 150 -32 27 4 37 1 57 -19 39 -42 75 -31 98 31 24 63 27 102 9 129 -21 32 -21 32 12 27 33 -4 127 36 192 83 62 45 104 65 135 65 19 0 47 20 100 73 41 39 85 74 97 77 26 6 41 33 59 102 12 43 11 51 -12 99 -13 29 -57 88 -96 132 l-73 79 0 58 c0 32 -8 86 -19 121 -10 35 -24 83 -30 106 -17 62 -100 144 -174 172 -119 44 -161 79 -169 139 -3 20 -19 60 -35 87 -16 28 -36 68 -45 90 -15 38 -66 85 -94 85 -7 0 -34 -19 -61 -42z' },
		{ id: 51, width: '146px', height: '184px', left: '130px', top: '422px', viewBox: '0 0 1460 1840', path: 'M850 971 c-47 -12 -156 -71 -180 -96 -13 -14 -31 -25 -40 -25 -18 0 -43 -25 -83 -86 -20 -30 -27 -52 -27 -91 0 -43 -6 -60 -46 -119 -50 -75 -81 -104 -69 -63 4 13 11 26 16 29 19 13 21 61 4 80 -26 29 -105 25 -105 -5 0 -7 -13 -29 -30 -50 -16 -20 -32 -53 -36 -71 -4 -24 -15 -39 -35 -50 -16 -8 -36 -26 -45 -40 -14 -21 -15 -29 -4 -48 10 -20 9 -28 -8 -52 -27 -38 -48 -178 -33 -216 13 -34 20 -34 74 -6 48 25 189 38 201 19 4 -6 27 -11 51 -11 50 0 68 17 110 106 25 53 25 54 45 34 47 -47 131 -6 146 70 11 52 49 106 83 118 40 14 68 56 51 77 -9 11 -11 36 -6 90 12 129 41 195 99 221 47 22 57 39 57 102 0 59 -13 73 -72 77 -24 1 -54 4 -68 7 -14 3 -36 3 -50 -1z' },
		{ id: 52, width: '146px', height: '184px', left: '215px', top: '470px', viewBox: '0 0 1460 1840', path: 'M509 645 c-19 -13 -44 -29 -55 -34 -12 -5 -27 -24 -33 -42 -21 -59 -85 -92 -203 -104 -42 -4 -72 -12 -80 -22 -16 -20 -19 -154 -4 -175 6 -8 29 -24 51 -35 24 -13 56 -43 80 -77 45 -63 84 -86 144 -86 41 0 81 26 81 53 0 14 -38 107 -62 153 l-17 30 52 -17 c72 -25 103 -24 132 6 28 27 31 49 10 85 -26 45 -19 97 20 150 39 53 43 80 18 105 -40 40 -88 44 -134 10z' },
		{ id: 53, width: '146px', height: '184px', left: '270px', top: '510px', viewBox: '0 0 1460 1840', path: 'M286 769 c-22 -32 -97 -79 -125 -79 -14 0 -40 -10 -58 -22 -30 -21 -33 -26 -28 -58 4 -19 15 -51 26 -72 16 -31 18 -50 13 -110 -4 -40 -13 -85 -20 -100 -19 -37 -18 -97 1 -104 8 -4 26 1 40 10 29 19 45 21 45 5 0 -7 9 -31 21 -54 15 -31 40 -54 92 -88 40 -26 80 -47 91 -47 10 0 54 18 98 40 87 43 125 49 183 24 50 -21 85 -6 122 51 15 23 56 72 90 109 58 61 65 66 105 66 42 0 101 30 151 75 25 23 15 61 -29 105 -32 33 -40 35 -117 42 -45 4 -102 10 -127 13 -38 6 -48 4 -64 -14 -17 -19 -17 -25 -6 -66 18 -63 8 -70 -69 -48 l-61 18 6 41 c5 36 2 46 -23 72 -41 45 -76 51 -107 17 -53 -57 -99 1 -94 118 l3 72 -72 3 c-64 3 -73 1 -87 -19z' },
		{ id: 54, width: '146px', height: '184px', left: '268px', top: '568px', viewBox: '0 0 1460 1840', path: 'M443 918 c-17 -18 -48 -42 -69 -52 -62 -32 -104 -66 -104 -85 0 -10 -8 -29 -18 -42 -10 -13 -27 -42 -39 -64 -63 -126 -122 -223 -146 -243 -27 -22 -31 -85 -9 -133 13 -28 18 -56 15 -77 -6 -38 23 -148 45 -174 18 -22 58 -23 92 -3 14 8 41 15 60 15 40 1 55 10 94 63 26 34 33 37 77 37 40 0 51 4 64 24 20 30 11 51 -46 108 -74 75 -95 162 -49 203 18 16 21 16 44 2 27 -18 38 -11 51 31 4 13 20 39 37 58 30 34 30 36 24 107 -4 40 -11 105 -14 145 -6 61 -11 77 -31 93 -32 26 -42 24 -78 -13z' },
		{ id: 55, width: '84px', height: '194px', left: '298px', top: '648px', viewBox: '0 0 840 1940', path: 'M287 1890 c-10 -16 -33 -44 -53 -62 -24 -23 -43 -58 -64 -117 -34 -96 -36 -114 -14 -167 14 -33 14 -51 5 -122 -6 -47 -15 -90 -20 -96 -9 -11 -22 -156 -24 -276 -1 -62 33 -185 55 -201 5 -3 3 -19 -3 -35 -9 -21 -13 -122 -14 -349 -1 -176 -4 -333 -8 -350 -8 -38 7 -55 49 -55 37 0 55 23 69 89 4 18 16 53 27 78 15 34 23 43 36 38 9 -4 35 -11 57 -16 47 -9 114 17 139 56 8 13 42 44 74 69 50 38 60 51 65 84 4 23 17 47 32 60 27 24 31 45 14 88 -15 41 -3 71 47 121 48 49 55 78 30 137 -10 25 -27 40 -60 54 -38 17 -46 26 -56 61 -18 66 -47 106 -98 134 -30 17 -52 37 -61 58 -8 17 -26 39 -41 47 -30 17 -50 66 -50 119 0 17 -9 38 -20 48 -26 24 -25 46 5 103 l25 46 -25 26 c-49 51 -44 175 10 261 45 71 30 99 -55 99 -51 0 -57 -2 -73 -30z' },
		{ id: 56, width: '146px', height: '184px', left: '82px', top: '185px', viewBox: '0 0 1460 1840', path: 'M391 1478 c-63 -67 -68 -94 -45 -262 5 -39 2 -57 -16 -93 -17 -34 -21 -56 -18 -101 2 -31 8 -65 12 -74 6 -13 4 -18 -8 -18 -9 0 -34 -6 -56 -12 -41 -13 -55 -43 -25 -54 19 -8 19 -33 0 -58 -9 -12 -15 -43 -15 -80 0 -113 -42 -184 -122 -206 -49 -14 -53 -50 -8 -67 23 -9 30 -18 30 -37 0 -14 13 -52 29 -84 17 -31 47 -91 67 -132 49 -100 71 -128 110 -140 28 -10 38 -8 71 12 21 13 60 29 88 36 27 7 53 18 56 24 4 7 13 41 19 77 22 117 39 176 56 186 10 6 24 19 33 29 49 59 36 56 218 49 146 -5 173 -4 201 11 34 18 39 37 21 83 -26 65 -33 109 -59 388 -5 55 -14 116 -20 135 -8 28 -30 288 -30 361 0 31 -41 36 -252 31 -187 -4 -208 -3 -208 12 0 13 -10 16 -49 16 -43 0 -54 -4 -80 -32z' },
		{ id: 57, width: '168px', height: '167px', left: '120px', top: '180px', viewBox: '0 0 1680 1670', path: 'M745 1591 c-154 -6 -158 -7 -217 -54 -25 -20 -34 -73 -17 -94 10 -11 14 -46 14 -112 0 -70 6 -117 22 -171 13 -41 23 -97 23 -125 1 -27 8 -95 16 -150 17 -120 34 -279 29 -283 -2 -2 -70 -6 -152 -8 -190 -6 -201 -8 -259 -46 -61 -40 -60 -38 -78 -121 -25 -110 -23 -125 20 -133 21 -4 57 -1 83 6 68 18 116 18 116 0 0 -20 -37 -28 -143 -29 -90 -1 -95 -2 -124 -31 -16 -16 -33 -30 -38 -30 -11 0 -19 -113 -8 -125 5 -6 74 -10 166 -10 l157 0 70 35 c90 44 159 51 215 21 48 -25 136 -28 166 -7 16 12 17 19 9 43 -13 34 -8 63 10 63 8 0 31 14 51 32 34 30 36 35 30 75 -5 35 -2 44 14 53 27 15 47 13 32 -2 -18 -18 -15 -63 6 -81 9 -8 31 -17 47 -20 26 -3 25 -4 -9 -6 -36 -1 -141 -51 -159 -75 -10 -15 1 -57 20 -78 20 -23 100 -24 169 -3 27 8 58 15 70 15 23 0 104 80 149 148 24 37 32 42 66 42 35 0 39 3 60 49 19 44 32 55 108 101 119 70 122 73 128 117 6 45 -10 62 -75 83 -34 11 -64 11 -144 3 l-102 -10 -59 45 c-74 56 -88 84 -60 115 11 12 26 33 33 45 6 13 26 30 44 37 18 8 44 30 57 49 13 20 27 36 31 36 18 0 88 56 88 69 -1 9 -37 45 -82 81 -88 71 -157 139 -174 173 -6 12 -14 58 -17 102 -5 78 -28 153 -51 167 -12 8 -113 8 -351 -1z' },
		{ id: 58, width: '174px', height: '144px', left: '221px', top: '235px', viewBox: '0 0 1740 1440', path: 'M610 1345 c0 -23 35 -84 51 -88 47 -13 -9 -78 -84 -97 -23 -6 -47 -13 -53 -15 -6 -2 -14 -17 -17 -33 -4 -20 -15 -33 -37 -42 -17 -7 -38 -24 -47 -37 -21 -31 -63 -30 -93 2 -14 14 -35 25 -50 25 -36 0 -128 -47 -142 -73 -8 -14 -13 -68 -13 -145 l0 -123 40 -36 c22 -19 68 -61 102 -92 34 -31 74 -63 88 -71 26 -14 29 -13 43 8 12 18 24 22 67 22 66 0 81 16 90 95 4 33 13 73 21 89 8 16 14 34 14 40 0 6 11 25 25 41 25 30 25 30 40 10 24 -30 29 -64 16 -100 -6 -17 -11 -45 -11 -63 0 -17 -4 -34 -10 -37 -20 -12 -9 -41 25 -63 33 -21 35 -26 35 -75 0 -29 -6 -61 -14 -72 -7 -11 -17 -31 -21 -45 -4 -14 -14 -33 -23 -42 -14 -16 -13 -20 2 -37 15 -16 17 -30 11 -70 -4 -28 -11 -54 -17 -57 -14 -9 -28 -52 -22 -67 3 -10 20 -12 62 -9 74 5 102 18 127 56 11 16 31 33 44 36 13 3 27 12 31 20 4 8 12 24 18 35 7 11 17 31 23 45 20 46 25 54 42 64 23 15 53 -16 66 -70 6 -24 16 -44 21 -44 5 0 21 21 36 48 15 26 39 69 55 95 16 27 29 60 29 75 0 22 13 37 64 74 35 26 76 52 90 58 15 5 32 24 40 44 8 19 25 42 38 50 37 24 68 88 81 168 11 69 14 74 57 106 36 27 49 46 67 95 26 74 28 96 8 103 -23 9 -69 -14 -80 -39 -8 -17 -21 -23 -55 -27 l-45 -5 4 -110 c2 -91 0 -113 -13 -124 -21 -18 -68 -6 -96 25 -22 22 -30 24 -121 24 l-98 0 -17 35 c-23 49 -13 69 31 61 57 -11 73 4 67 64 -4 49 -3 51 39 89 l43 40 -28 27 -27 28 -35 -19 c-25 -13 -37 -28 -44 -55 -20 -75 -75 -79 -110 -9 -23 43 -43 55 -119 65 -34 4 -57 14 -72 30 -13 14 -34 24 -49 24 -15 0 -38 8 -51 19 -50 38 -139 75 -139 56z' },
		{ id: 59, width: '141px', height: '128px', left: '355px', top: '110px', viewBox: '0 0 1410 1280', path: 'M640 1210 c-25 -16 -57 -30 -72 -30 -15 0 -30 -5 -33 -10 -4 -6 -24 -19 -46 -31 -23 -11 -44 -31 -50 -47 -6 -15 -22 -39 -36 -54 -22 -23 -25 -32 -19 -69 8 -51 -8 -79 -58 -103 -31 -15 -36 -22 -36 -51 0 -26 -7 -38 -31 -56 -55 -39 -79 -69 -79 -99 0 -16 6 -33 14 -37 26 -15 73 -127 80 -191 9 -82 17 -102 62 -151 33 -37 41 -41 83 -41 35 0 49 -5 59 -20 25 -41 93 -74 157 -76 33 -1 103 -16 155 -32 120 -38 172 -45 235 -31 28 6 67 13 87 16 29 4 42 13 58 40 19 32 24 35 53 29 117 -24 122 -22 130 71 7 70 -2 96 -45 134 -22 20 -23 28 -2 43 27 21 15 166 -18 203 -27 32 -45 78 -37 99 4 10 8 31 8 45 1 23 -8 30 -76 62 -43 19 -103 42 -134 51 -32 10 -74 32 -97 51 -22 19 -61 44 -86 55 l-46 19 6 45 c6 38 4 46 -15 55 -12 7 -21 21 -21 35 0 13 -14 42 -30 64 -36 50 -57 52 -120 12z' },
		{ id: 60, width: '146px', height: '184px', left: '535px', top: '124px', viewBox: '0 0 1460 1840', path: 'M223 423 c-18 -10 -48 -37 -68 -60 -65 -77 -57 -211 19 -299 31 -35 36 -38 62 -29 21 8 30 19 34 40 5 30 17 38 100 71 69 27 128 66 134 89 8 31 -26 125 -56 156 -16 16 -43 30 -65 33 -115 17 -128 17 -160 -1z' },
		{ id: 61, width: '146px', height: '184px', left: '590px', top: '135px', viewBox: '0 0 1460 1840', path: 'M105 1191 c-42 -26 -68 -58 -62 -75 3 -8 1 -30 -5 -50 -8 -26 -8 -46 0 -73 7 -21 14 -59 17 -84 6 -64 39 -116 89 -141 22 -11 56 -34 74 -49 18 -16 37 -29 41 -29 5 0 12 -11 15 -24 3 -14 17 -37 30 -53 21 -25 66 -112 66 -128 0 -4 9 -20 21 -36 16 -23 19 -38 14 -70 -9 -54 17 -93 120 -177 22 -18 47 -45 56 -60 8 -15 39 -39 68 -55 61 -31 68 -29 101 35 28 54 20 89 -28 121 -124 82 -213 221 -251 394 -16 70 -25 91 -46 107 -38 27 -47 59 -35 125 9 52 8 61 -15 109 -15 31 -25 69 -25 95 0 48 0 48 -103 102 -77 40 -100 43 -142 16z' },
		{ id: 62, width: '146px', height: '184px', left: '655px', top: '230px', viewBox: '0 0 1460 1840', path: 'M518 1629 c-22 -12 -22 -31 -4 -84 13 -35 12 -42 -1 -57 -21 -23 -45 -23 -85 2 -24 15 -51 20 -100 20 -75 0 -114 -13 -121 -41 -3 -10 -16 -23 -30 -28 -56 -22 -116 -126 -88 -154 6 -6 11 -24 11 -40 0 -16 14 -49 30 -74 24 -35 28 -48 20 -63 -5 -10 -10 -28 -10 -39 0 -43 34 -140 57 -166 l25 -26 -27 -40 c-29 -41 -29 -37 -9 -160 3 -21 1 -46 -6 -59 -11 -21 -16 -22 -75 -15 -84 9 -105 -3 -105 -55 0 -29 6 -43 22 -54 20 -14 22 -24 23 -112 0 -84 2 -97 20 -110 19 -15 32 -14 83 1 29 9 30 -17 2 -52 -35 -44 -22 -143 18 -143 9 0 30 -7 47 -16 61 -32 138 10 119 64 -7 20 -6 35 5 57 8 16 18 52 22 79 8 49 32 86 55 86 8 0 31 7 53 16 33 13 43 24 61 69 12 30 29 57 39 60 9 3 27 21 40 40 22 33 23 36 7 60 -22 34 -20 38 14 30 27 -6 36 -2 65 29 19 20 48 39 65 42 17 4 36 16 42 27 6 12 20 28 31 37 27 22 17 59 -28 103 -19 19 -35 42 -35 52 0 10 -7 26 -16 36 -13 14 -14 24 -5 56 15 51 16 47 -23 85 -27 26 -38 46 -47 95 -11 55 -11 69 4 110 20 57 21 77 5 103 -10 15 -10 27 1 55 16 45 8 69 -33 94 -17 11 -47 36 -64 56 -34 37 -46 41 -74 24z' },
		{ id: 63, width: '146px', height: '184px', left: '723px', top: '316px', viewBox: '0 0 1460 1840', path: 'M460 1049 c-33 -33 -60 -68 -60 -77 0 -10 -13 -23 -29 -30 -20 -9 -34 -25 -41 -47 -7 -21 -25 -42 -46 -55 -19 -12 -34 -25 -34 -30 0 -4 -20 -27 -45 -51 -25 -24 -45 -50 -45 -57 0 -8 9 -31 19 -51 11 -20 22 -49 26 -64 3 -15 25 -47 49 -70 23 -23 46 -50 49 -60 7 -19 -9 -28 -105 -62 -84 -29 -100 -94 -33 -138 19 -12 35 -27 35 -33 0 -12 38 -47 70 -64 27 -14 77 -6 102 17 17 15 20 15 41 -5 18 -17 36 -22 73 -22 27 0 54 4 61 8 16 10 33 57 33 91 0 23 7 31 40 46 50 23 66 41 74 86 7 42 -6 58 -56 68 -51 10 -57 33 -20 75 41 47 40 67 -3 115 -37 41 -44 74 -20 105 8 11 15 35 15 53 0 22 14 56 40 97 33 52 40 72 40 113 0 39 -5 56 -25 77 -21 23 -32 26 -85 26 l-60 0 -60 -61z' },
		{ id: 64, width: '146px', height: '184px', left: '953px', top: '312px', viewBox: '0 0 1460 1840', path: 'M640 770 c-23 -12 -55 -19 -92 -20 -76 0 -103 -14 -128 -66 -11 -24 -25 -44 -31 -44 -6 0 -41 -12 -77 -26 -85 -33 -112 -61 -112 -118 0 -34 -5 -45 -22 -55 -29 -15 -78 -83 -78 -108 0 -19 56 -78 100 -105 55 -33 93 -39 141 -22 78 29 109 34 109 17 0 -20 30 -76 49 -90 9 -7 28 -16 42 -22 37 -13 118 25 154 73 24 32 32 36 57 31 20 -5 51 3 112 29 97 42 108 43 176 16 65 -26 110 -25 144 1 22 17 26 28 26 70 l0 49 38 0 c48 0 69 21 78 78 8 49 -6 72 -44 72 -14 0 -39 11 -56 24 -43 32 -111 66 -135 66 -33 0 -51 11 -51 32 0 87 -296 175 -400 118z' },
		{ id: 65, width: '146px', height: '184px', left: '1040px', top: '400px', viewBox: '0 0 1460 1840', path: '' },
		{ id: 66, width: '146px', height: '184px', left: '1040px', top: '400px', viewBox: '0 0 1460 1840', path: '' },
		{ id: 67, width: '146px', height: '184px', left: '1122px', top: '595px', viewBox: '0 0 1460 1840', path: 'M833 610 c-18 -10 -41 -37 -52 -58 -25 -49 -48 -59 -73 -32 -30 32 -67 36 -109 12 -26 -15 -55 -22 -92 -22 -66 0 -82 -14 -62 -53 12 -24 11 -31 -11 -71 -30 -54 -73 -71 -203 -81 -97 -8 -108 -11 -121 -36 -13 -24 2 -61 46 -113 64 -75 115 -85 180 -36 35 27 46 29 118 30 72 0 84 3 150 39 66 37 228 101 287 115 32 7 78 51 84 80 13 70 18 107 19 151 1 49 1 50 -44 73 -54 27 -76 28 -117 2z' },
		{ id: 68, width: '92px', height: '118px', left: '1162px', top: '690px', viewBox: '0 0 920 1180', path: 'M155 1161 c-3 -11 -3 -31 1 -44 5 -24 3 -26 -33 -29 -35 -3 -38 -6 -41 -35 -2 -18 4 -43 12 -55 9 -12 16 -28 16 -35 0 -14 47 -62 145 -148 90 -79 105 -96 105 -115 0 -9 9 -25 20 -35 11 -10 20 -26 20 -36 0 -10 10 -30 23 -44 22 -25 23 -25 102 -17 44 5 82 8 84 6 8 -7 -24 -36 -56 -49 -27 -11 -33 -19 -33 -44 0 -18 8 -35 20 -44 11 -7 23 -31 28 -53 9 -45 -1 -66 -81 -174 -43 -58 -48 -69 -45 -110 3 -45 3 -45 42 -48 21 -2 43 1 49 7 6 6 19 11 28 11 9 0 25 12 35 27 10 16 24 34 31 41 7 7 13 19 13 26 0 7 13 22 30 34 17 13 34 39 41 62 18 60 39 75 84 60 70 -23 109 9 86 71 -6 16 -16 42 -22 58 -6 15 -22 33 -35 40 -17 7 -37 36 -61 86 -45 95 -81 127 -136 123 -36 -3 -41 0 -47 22 -14 46 -78 140 -122 180 -33 28 -47 51 -57 87 -20 74 -59 126 -101 134 -19 4 -36 12 -38 18 -14 42 -95 58 -107 22z' },
		{ id: 69, width: '182px', height: '146px', left: '961px', top: '687px', viewBox: '0 0 1920 1560', path: 'M1532 1539 c-38 -18 -44 -18 -64 -5 -19 13 -25 13 -56 0 -20 -8 -42 -12 -49 -10 -7 3 -15 1 -18 -4 -4 -6 -14 -10 -24 -10 -28 0 -61 -42 -61 -78 0 -21 -7 -35 -19 -42 -25 -13 -54 -13 -46 0 4 6 -12 10 -39 10 -34 0 -46 -4 -46 -15 0 -10 10 -15 33 -15 42 0 60 -13 54 -36 -4 -17 -6 -17 -12 4 -6 17 -15 22 -41 22 -50 0 -104 -29 -101 -54 1 -15 -3 -20 -15 -18 -10 2 -18 -2 -18 -8 0 -5 5 -10 10 -10 21 0 -58 -71 -82 -74 -12 -1 -33 -8 -45 -14 -32 -18 -92 -15 -158 8 -32 11 -70 20 -85 20 -40 0 -118 37 -125 60 -7 22 -8 22 -118 22 -59 0 -80 3 -84 14 -3 8 -13 14 -23 14 -10 0 -23 7 -30 15 -19 23 -101 20 -133 -5 -14 -11 -30 -20 -36 -20 -18 0 -13 -48 5 -52 25 -5 27 -70 4 -120 -11 -24 -20 -53 -20 -65 0 -12 -9 -38 -20 -58 -11 -20 -20 -42 -20 -51 0 -8 -11 -32 -25 -52 -25 -37 -34 -102 -14 -102 7 0 9 9 5 23 -4 17 -1 23 13 23 16 0 16 -3 3 -29 -8 -17 -11 -39 -7 -55 3 -15 8 -44 10 -64 3 -42 12 -59 28 -57 24 3 35 -2 70 -30 20 -15 33 -32 29 -36 -4 -4 8 -5 26 -2 20 4 47 1 66 -7 18 -8 52 -17 74 -21 29 -4 48 -15 62 -33 11 -15 25 -33 32 -41 7 -8 11 -26 10 -41 -4 -33 37 -72 77 -74 27 -1 30 -4 26 -28 -4 -21 -1 -28 10 -28 9 0 13 -5 10 -10 -3 -6 -1 -10 5 -10 6 0 8 -4 5 -10 -3 -5 1 -10 10 -10 8 0 21 -11 27 -25 13 -28 28 -33 28 -9 0 13 3 14 14 5 17 -14 41 -4 68 28 17 20 75 31 64 12 -6 -10 16 -61 27 -61 4 0 7 -6 7 -13 0 -7 9 -23 20 -35 l21 -22 -26 0 c-50 0 -21 -43 32 -45 21 -1 48 -5 59 -9 15 -5 23 -2 28 10 3 8 11 14 18 12 7 -3 20 2 29 10 31 27 75 22 108 -10 16 -16 32 -25 35 -20 3 5 2 12 -1 16 -11 11 -12 36 -1 36 15 0 0 53 -19 68 -15 11 -15 12 5 12 17 0 22 6 22 25 0 28 -12 32 -33 10 -13 -12 -16 -12 -20 -1 -11 29 0 51 31 61 18 5 32 15 32 22 0 7 7 13 15 13 8 0 15 5 15 10 0 18 44 29 53 14 15 -27 35 -16 33 19 -1 26 3 32 19 32 32 0 55 -61 59 -153 2 -44 7 -85 11 -92 5 -9 4 -11 -3 -6 -16 10 -15 0 3 -27 8 -13 15 -44 16 -70 2 -30 6 -46 13 -44 6 3 10 10 8 16 -1 7 4 19 13 27 8 9 15 24 15 35 0 12 4 17 11 14 6 -4 9 -1 8 6 -2 13 7 74 17 111 3 9 11 15 18 12 24 -9 62 38 64 79 2 22 9 49 16 60 8 12 17 41 21 64 5 33 12 44 35 53 16 7 35 18 41 26 6 8 23 14 36 14 22 0 25 4 21 25 -3 14 -2 25 3 25 4 0 11 15 14 34 6 28 11 33 31 30 25 -2 45 21 37 42 -2 6 19 35 47 65 33 35 50 47 50 36 0 -9 5 -17 10 -17 10 0 15 16 10 35 -9 37 -9 85 -1 85 15 0 14 92 -3 175 -17 88 -30 119 -54 137 -17 11 -50 72 -56 103 -1 6 -10 22 -19 37 -10 14 -19 41 -20 60 -3 47 -11 55 -64 62 -34 4 -58 15 -80 36 -18 17 -33 30 -35 29 -2 0 -22 -10 -46 -20z m-375 -248 c7 -19 12 -35 10 -36 -1 -1 -20 16 -42 37 -22 21 -32 36 -22 32 10 -4 17 -3 16 2 -7 40 21 14 38 -35z' },
		{ id: 70, width: '146px', height: '184px', left: '886px', top: '417px', viewBox: '0 0 1460 1840', path: 'M353 1542 c-3 -9 -23 -61 -44 -116 -22 -54 -39 -114 -39 -133 0 -18 -8 -48 -17 -66 -17 -32 -27 -93 -39 -239 -8 -96 -19 -108 -75 -83 -50 23 -66 8 -40 -36 15 -27 15 -29 -12 -57 -36 -37 -34 -50 8 -68 30 -12 35 -19 35 -47 0 -17 -7 -45 -15 -61 -20 -39 -13 -57 41 -101 24 -20 54 -55 67 -77 12 -22 30 -55 39 -72 21 -38 22 -95 3 -120 -19 -25 -19 -56 0 -83 13 -18 13 -24 2 -35 -8 -7 -19 -23 -25 -34 -9 -18 -7 -24 18 -42 35 -27 47 -27 54 -4 11 34 62 54 117 47 46 -6 49 -5 49 15 0 12 -6 31 -12 43 -7 12 -13 42 -14 67 0 25 -7 60 -15 78 -14 33 -13 34 21 62 28 23 34 34 33 65 -1 32 6 45 51 91 40 41 59 54 82 54 16 0 40 7 54 15 14 8 39 21 56 29 30 15 31 17 37 103 6 82 5 89 -17 113 -13 14 -41 50 -62 81 -53 76 -147 192 -186 228 -27 25 -33 40 -39 88 -7 61 -29 165 -51 247 -10 35 -20 51 -36 57 -17 7 -24 5 -29 -9z' },
		{ id: 71, width: '146px', height: '184px', left: '750px', top: '703px', viewBox: '0 0 1460 1840', path: 'M135 848 c-26 -15 -33 -25 -47 -73 -20 -69 -19 -131 3 -151 10 -9 19 -23 19 -30 0 -7 14 -29 31 -49 l31 -35 -11 -65 c-11 -64 -11 -68 16 -117 30 -55 33 -58 103 -82 45 -16 90 -55 180 -155 26 -29 53 -50 59 -47 29 18 56 206 32 220 -18 12 -71 117 -71 142 0 14 -23 72 -51 128 -28 55 -64 132 -80 170 -39 94 -69 130 -117 144 -48 15 -71 15 -97 0z' },
		{ id: 72, width: '146px', height: '184px', left: '673px', top: '693px', viewBox: '0 0 1460 1840', path: 'M323 959 c-7 -7 -9 -30 -6 -63 4 -34 0 -63 -10 -87 -13 -31 -24 -40 -74 -59 -63 -24 -93 -45 -93 -68 0 -8 -14 -30 -30 -49 -38 -42 -38 -77 -2 -112 15 -16 34 -39 43 -52 9 -14 59 -48 111 -77 90 -50 95 -54 117 -107 12 -30 26 -78 30 -107 7 -54 25 -98 40 -98 4 0 13 11 19 24 19 43 55 58 134 59 40 0 85 -3 99 -7 l26 -8 5 99 c3 54 9 105 12 114 13 29 -36 82 -105 116 -72 34 -196 141 -205 178 -3 13 3 36 15 56 19 33 20 39 7 99 -10 54 -18 67 -42 82 -16 10 -40 31 -54 48 -19 23 -28 28 -37 19z' },
		{ id: 73, width: '146px', height: '184px', left: '603px', top: '668px', viewBox: '0 0 1460 1840', path: 'M373 1300 c-51 -31 -63 -64 -82 -228 -7 -59 -15 -83 -44 -125 -19 -29 -38 -71 -42 -95 -4 -24 -17 -62 -30 -85 -14 -26 -25 -67 -28 -110 -6 -65 -5 -72 33 -145 32 -60 41 -92 46 -148 6 -65 5 -74 -14 -90 -17 -14 -20 -25 -15 -59 3 -29 0 -52 -12 -74 -27 -53 -17 -61 78 -61 l83 0 22 45 c33 69 91 84 112 30 7 -19 17 -25 38 -25 45 0 63 20 69 76 7 82 12 95 53 136 61 60 66 112 13 123 -54 12 -58 18 -66 106 -7 75 -5 86 13 111 27 37 26 45 -15 59 -30 11 -38 22 -56 68 -15 40 -19 68 -14 97 4 32 2 43 -9 47 -8 3 -22 21 -32 38 -15 29 -15 45 -5 148 6 64 9 131 5 149 -6 28 -10 32 -38 32 -17 0 -45 -9 -63 -20z' },
		{ id: 74, width: '146px', height: '184px', left: '503px', top: '440px', viewBox: '0 0 1460 1840', path: 'M740 970 c0 -11 -12 -27 -27 -37 -16 -9 -59 -47 -98 -83 -38 -36 -88 -79 -110 -95 -60 -45 -208 -197 -222 -228 -9 -18 -23 -30 -43 -33 -29 -6 -40 -27 -21 -39 18 -11 59 -95 66 -134 5 -30 15 -46 38 -62 18 -12 57 -46 87 -75 l55 -53 67 11 c64 11 69 11 124 -16 89 -44 110 -48 357 -73 74 -7 102 12 93 67 -17 106 -18 121 -7 134 9 11 6 22 -14 51 -14 21 -25 42 -25 47 0 5 -11 26 -25 46 -23 33 -25 46 -25 144 l0 107 45 42 c25 23 45 48 45 55 0 8 -15 24 -34 36 -18 13 -60 43 -92 68 -84 64 -119 87 -174 115 -59 30 -60 30 -60 5z' },
		{ id: 75, width: '146px', height: '184px', left: '470px', top: '535px', viewBox: '0 0 1460 1840', path: 'M485 780 c-16 -16 -34 -30 -40 -30 -21 0 -163 -120 -169 -143 -3 -12 -6 -35 -6 -51 0 -26 -52 -108 -98 -155 -31 -31 -46 -67 -55 -125 -18 -117 -18 -117 55 -205 8 -9 31 -12 82 -9 100 5 135 34 157 128 4 19 11 49 15 65 9 37 19 45 62 45 51 0 70 16 87 72 19 65 19 141 0 214 -14 55 -14 59 5 79 29 31 25 75 -9 113 -37 40 -50 40 -86 2z' },
		{ id: 76, width: '146px', height: '184px', left: '1040px', top: '400px', viewBox: '0 0 1460 1840', path: '' },
		{ id: 77, width: '146px', height: '184px', left: '302px', top: '607px', viewBox: '0 0 1460 1840', path: 'M588 933 c-33 -17 -44 -52 -29 -94 6 -17 9 -35 6 -39 -3 -4 -29 -19 -58 -34 -29 -14 -59 -37 -67 -51 -14 -27 -27 -32 -81 -37 -23 -1 -45 5 -66 20 -65 46 -103 16 -103 -84 0 -49 -4 -64 -21 -80 -37 -33 -41 -61 -34 -242 l7 -172 27 -6 c14 -4 35 -14 46 -23 79 -67 135 -66 135 1 0 36 25 60 102 99 74 38 84 49 91 107 4 33 12 50 36 70 28 24 33 36 41 102 5 41 10 96 10 123 0 40 4 49 23 58 13 6 28 23 35 37 6 15 23 49 38 75 35 62 27 86 -44 144 -58 47 -56 47 -94 26z' },
		{ id: 78, width: '146px', height: '184px', left: '275px', top: '472px', viewBox: '0 0 1460 1840', path: 'M412 319 c-28 -28 -68 -57 -89 -64 -27 -9 -45 -24 -60 -51 -24 -43 -43 -55 -131 -85 -66 -22 -74 -37 -29 -53 36 -13 138 33 198 89 51 48 107 76 187 95 41 9 56 18 65 38 9 20 9 26 0 29 -7 3 -28 15 -48 29 -20 13 -37 24 -39 24 -2 0 -26 -23 -54 -51z' },
	];
}

function getGameTerritories() {
	var terrs = [];
	var x = 1;
	terrs.push({ id: x++, name: 'Eastern USA', x: 290, y: 311, nation: 1, owner: 0, type: 0, capital: true, water: 101, land: [2, 58], enemyWater: 109, enemyZone: 9, enemyWater2: 104, enemyZone2: 43, borders: '2+58+101+100' });
	terrs.push({ id: x++, name: 'Central USA', x: 244, y: 294, nation: 1, owner: 0, type: 0, water: 0, borders: '57+58+1+100+3', land: [1, 3, 57, 58] });
	terrs.push({ id: x++, name: 'Midwest USA', x: 196, y: 305, nation: 1, owner: 0, type: 0, water: 0, borders: '4+57+2+100+51', land: [4, 56, 57, 2, 51] });
	terrs.push({ id: x++, name: 'Western USA', x: 138, y: 286, nation: 1, owner: 0, type: 0, water: 0, borders: '82+56+57+3+51', land: [56, 57, 3, 51] });
	terrs.push({ id: x++, name: 'Alaska', x: 76, y: 111, nation: 1, owner: 0, type: 0, water: 0, borders: '79+80+56+22', land: [56, 22] });
	terrs.push({ id: x++, name: 'Hawaii', x: 79, y: 401, nation: 1, owner: 0, type: 0, water: 0, borders: '83', land: [] });
	terrs.push({ id: x++, name: 'Germany', x: 627, y: 217, nation: 2, owner: 0, type: 0, capital: true, water: 110, land: [8, 12, 62], enemyWater: 110, enemyZone: 10, enemyWater2: 106, enemyZone2: 58, borders: '110+113+62+12+8' });
	terrs.push({ id: x++, name: 'France', x: 570, y: 255, nation: 2, owner: 0, type: 0, water: 0, borders: '109+7+12+114+9', land: [7, 9, 12] });
	terrs.push({ id: x++, name: 'Spain', x: 521, y: 297, nation: 2, owner: 0, type: 0, water: 0, borders: '109+105+114+8', land: [8] });
	terrs.push({ id: x++, name: 'United Kingdom', x: 554, y: 166, nation: 2, owner: 0, type: 0, water: 0, borders: '109+110', land: [] });
	terrs.push({ id: x++, name: 'Sweden Finland', x: 655, y: 84, nation: 2, owner: 0, type: 0, water: 0, borders: '113+61+14+111', land: [14, 61] });
	terrs.push({ id: x++, name: 'Southern Europe', x: 645, y: 285, nation: 2, owner: 0, type: 0, water: 0, borders: '8+7+62+116+115+36', land: [7, 8, 62, 36] });
	terrs.push({ id: x++, name: 'Russia', x: 855, y: 128, nation: 3, owner: 0, type: 0, capital: true, water: 112, land: [14, 16, 17, 19, 18], enemyWater: 109, enemyZone: 8, enemyWater2: 109, enemyZone2: 10, borders: '112+18+19+17+16+14' });
	terrs.push({ id: x++, name: 'Karelia', x: 752, y: 94, nation: 3, owner: 0, type: 0, water: 0, borders: '112+11+113+62+15+16+13', land: [11, 62, 13, 15, 16] });
	terrs.push({ id: x++, name: 'Chechnya', x: 733, y: 181, nation: 3, owner: 0, type: 0, water: 0, borders: '14+62+116+63+16', land: [62, 14, 16, 63] });
	terrs.push({ id: x++, name: 'Caucasus', x: 782, y: 191, nation: 3, owner: 0, type: 0, water: 0, borders: '14+15+63+17+13', land: [14, 15, 13, 17, 63] });
	terrs.push({ id: x++, name: 'Kazakhstan', x: 871, y: 275, nation: 3, owner: 0, type: 0, water: 0, borders: '16+63+117+38+39+70+29+19+13', land: [13, 16, 63, 38, 39, 70, 29, 19] });
	terrs.push({ id: x++, name: 'Taimyr', x: 967, y: 98, nation: 3, owner: 0, type: 0, water: 0, borders: '13+20+19', land: [13, 19, 20] });
	terrs.push({ id: x++, name: 'Novosibirsk', x: 945, y: 209, nation: 3, owner: 0, type: 0, water: 0, borders: '13+18+20+64+29+17', land: [13, 17, 29, 64, 20, 18] });
	terrs.push({ id: x++, name: 'Siberia', x: 1055, y: 101, nation: 3, owner: 0, type: 0, water: 0, borders: '18+19+64+24+23+22', land: [18, 19, 64, 24, 23, 22] });
	terrs.push({ id: x++, name: 'Japan', x: 1187, y: 271, nation: 4, owner: 0, type: 0, capital: true, water: 141, land: [24], enemyWater: 137, enemyZone: 32, enemyWater2: 139, enemyZone2: 26, borders: '24+141+142' });
	terrs.push({ id: x++, name: 'Far East', x: 1166, y: 73, nation: 4, owner: 0, type: 0, water: 0, borders: '20+23+144+5', land: [20, 23, 5] });
	terrs.push({ id: x++, name: 'Okhotsk', x: 1126, y: 211, nation: 4, owner: 0, type: 0, water: 0, borders: '22+20+24+141', land: [22, 20, 24] });
	terrs.push({ id: x++, name: 'Manchuria', x: 1091, y: 258, nation: 4, owner: 0, type: 0, water: 0, borders: '20+23+141+21+25+30+64', land: [20, 23, 64, 30, 25, 21] });
	terrs.push({ id: x++, name: 'Peiping', x: 1075, y: 330, nation: 4, owner: 0, type: 0, water: 0, borders: '30+24+138+31', land: [30, 31, 24] });
	terrs.push({ id: x++, name: 'Taiwan', x: 1138, y: 394, nation: 4, owner: 0, type: 0, water: 0, borders: '139', land: [] });
	terrs.push({ id: x++, name: 'Marshall Islands', x: 1214, y: 387, nation: 4, owner: 0, type: 0, water: 0, borders: '140', land: [] });
	terrs.push({ id: x++, name: 'Indo-China', x: 985, y: 441, nation: 5, owner: 0, type: 0, capital: true, land: [70, 29, 30, 31, 34], water: 131, enemyWater: 139, enemyZone: 26, enemyWater2: 137, enemyZone2: 32, borders: '70+29+30+31+131+34' });
	terrs.push({ id: x++, name: 'Tibet', x: 961, y: 320, nation: 5, owner: 0, type: 0, water: 0, borders: '17+19+64+30+28+70', land: [28, 70, 17, 19, 20, 24, 30] });
	terrs.push({ id: x++, name: 'China', x: 1018, y: 338, nation: 5, owner: 0, type: 0, water: 0, borders: '64+24+25+31+28+29', land: [28, 29, 64, 24, 25] });
	terrs.push({ id: x++, name: 'Hong Kong', x: 1054, y: 382, nation: 5, owner: 0, type: 0, water: 0, borders: '25+138+28+30', land: [28, 30, 25] });
	terrs.push({ id: x++, name: 'Philippines', x: 1094, y: 469, nation: 5, owner: 0, type: 0, water: 0, borders: '137', land: [] });
	terrs.push({ id: x++, name: 'Borneo', x: 1058, y: 507, nation: 5, owner: 0, type: 0, water: 0, borders: '134', land: [] });
	terrs.push({ id: x++, name: 'Indonesia', x: 1009, y: 536, nation: 5, owner: 0, type: 0, water: 0, borders: '28+131+130', land: [28] });
	terrs.push({ id: x++, name: 'Saudi Arabia', x: 784, y: 434, nation: 6, owner: 0, type: 0, capital: true, water: 118, land: [37], enemyWater: 114, enemyZone: 8, enemyWater2: 120, enemyZone2: 70, borders: '118+37+119' });
	terrs.push({ id: x++, name: 'Turkey', x: 715, y: 322, nation: 6, owner: 0, type: 0, water: 0, borders: '12+116+63+38+37+115', land: [12, 63, 37, 38] });
	terrs.push({ id: x++, name: 'Syria-Iraq', x: 745, y: 370, nation: 6, owner: 0, type: 0, water: 0, borders: '115+36+38+35+40+118+119', land: [36, 40, 38, 35] });
	terrs.push({ id: x++, name: 'Iran', x: 819, y: 362, nation: 6, owner: 0, type: 0, water: 0, borders: '119+117+37+36+39+63+17', land: [36, 37, 63, 17, 39] });
	terrs.push({ id: x++, name: 'Afghan-Pakistan', x: 871, y: 379, nation: 6, owner: 0, type: 0, water: 0, borders: '17+38+70+120', land: [38, 17, 70] });
	terrs.push({ id: x++, name: 'Egypt', x: 699, y: 409, nation: 6, owner: 0, type: 0, water: 0, borders: '115+118+37+46+41', land: [41, 46, 37] });
	terrs.push({ id: x++, name: 'Libya', x: 642, y: 403, nation: 6, owner: 0, type: 0, water: 0, borders: '115+74+45+46+40', land: [74, 45, 46, 40] });
	terrs.push({ id: x++, name: 'Congo', x: 659, y: 541, nation: 7, owner: 0, type: 0, capital: true, water: 96, land: [44, 45, 46, 48, 73], enemyWater: 98, enemyZone: 50, enemyWater2: 104, enemyZone2: 43, borders: '96+73+48+46+45+44' });
	terrs.push({ id: x++, name: 'West Africa', x: 530, y: 442, nation: 7, owner: 0, type: 0, water: 0, borders: '104+74+45+44+75', land: [74, 75, 44, 45] });
	terrs.push({ id: x++, name: 'Nigeria', x: 594, y: 495, nation: 7, owner: 0, type: 0, water: 0, borders: '75+43+45+42+96', land: [75, 43, 45, 42] });
	terrs.push({ id: x++, name: 'Chad', x: 638, y: 458, nation: 7, owner: 0, type: 0, water: 0, borders: '43+74+41+46+42+44', land: [43, 44, 74, 41, 46, 42] });
	terrs.push({ id: x++, name: 'Sudan', x: 695, y: 472, nation: 7, owner: 0, type: 0, water: 0, borders: '118+41+40+47+48+42+45', land: [45, 42, 48, 47, 40, 41] });
	terrs.push({ id: x++, name: 'Ethiopia', x: 753, y: 500, nation: 7, owner: 0, type: 0, water: 0, borders: '118+46+48+121', land: [46, 48] });
	terrs.push({ id: x++, name: 'Kenya', x: 732, y: 558, nation: 7, owner: 0, type: 0, water: 0, borders: '46+47+121+72+42+73+49', land: [42, 46, 47, 73, 49, 72] });
	terrs.push({ id: x++, name: 'South Africa', x: 676, y: 700, nation: 7, owner: 0, type: 0, water: 0, borders: '73+48+72+123', land: [72, 73, 48] });
	terrs.push({ id: x++, name: 'Brazil', x: 376, y: 501, nation: 8, owner: 0, type: 0, capital: true, water: 98, land: [53, 54, 55, 77], enemyWater: 104, enemyZone: 43, enemyWater2: 104, enemyZone2: 43, borders: '53+54+77+55+98' });
	terrs.push({ id: x++, name: 'Mexico', x: 197, y: 385, nation: 8, owner: 0, type: 0, water: 0, borders: '4+3+85+86+100+52', land: [3, 4, 52] });
	terrs.push({ id: x++, name: 'Panama', x: 258, y: 407, nation: 8, owner: 0, type: 0, water: 0, borders: '51+53+100+86+99', land: [51, 53] });
	terrs.push({ id: x++, name: 'Venezuela', x: 313, y: 444, nation: 8, owner: 0, type: 0, water: 0, borders: '52+54+50+86+99+103', land: [50, 52, 54] });
	terrs.push({ id: x++, name: 'Peru', x: 289, y: 514, nation: 8, owner: 0, type: 0, water: 0, borders: '91+53+50+77+55', land: [50, 53, 55, 77] });
	terrs.push({ id: x++, name: 'Argentina', x: 332, y: 635, nation: 8, owner: 0, type: 0, water: 0, borders: '91+54+77+92+93+50', land: [50, 54, 77] });
	terrs.push({ id: x++, name: 'British Columbia', x: 147, y: 184, nation: 0, owner: 0, type: 0, water: 0, borders: '5+80+82+4+57', land: [4, 5, 57] });
	terrs.push({ id: x++, name: 'Central Canada', x: 208, y: 180, nation: 0, owner: 0, type: 0, water: 0, borders: '56+4+3+2+58+108', land: [56, 58, 2, 3, 4] });
	terrs.push({ id: x++, name: 'Quebec', x: 318, y: 205, nation: 0, owner: 0, type: 0, water: 0, borders: '57+108+106+1+2', land: [1, 2, 57] });
	terrs.push({ id: x++, name: 'Greenland', x: 424, y: 75, nation: 0, owner: 0, type: 0, water: 0, borders: '107', land: [] });
	terrs.push({ id: x++, name: 'Iceland', x: 565, y: 45, nation: 0, owner: 0, type: 0, water: 0, borders: '111', land: [] });
	terrs.push({ id: x++, name: 'Norway', x: 604, y: 117, nation: 0, owner: 0, type: 0, water: 0, borders: '111+110+11', land: [11] });
	terrs.push({ id: x++, name: 'Ukraine', x: 697, y: 228, nation: 0, owner: 0, type: 0, water: 0, borders: '113+7+12+116+15+14', land: [7, 12, 14, 15] });
	terrs.push({ id: x++, name: 'Georgia', x: 764, y: 265, nation: 0, owner: 0, type: 0, water: 0, borders: '116+15+16+17+117+38+36', land: [15, 16, 17, 36, 38] });
	terrs.push({ id: x++, name: 'Mongolia', x: 1019, y: 269, nation: 0, owner: 0, type: 0, water: 0, borders: '19+20+24+30+29', land: [19, 20, 24, 29, 30] });
	terrs.push({ id: x++, name: 'Guam', x: 1247, y: 315, nation: 0, owner: 0, type: 0, water: 0, borders: '143', land: [] });
	terrs.push({ id: x++, name: 'Solomon Isle', x: 1179, y: 461, nation: 0, owner: 0, type: 0, water: 0, borders: '136', land: [] });
	terrs.push({ id: x++, name: 'New Guinea', x: 1180, y: 524, nation: 0, owner: 0, type: 0, water: 0, borders: '135', land: [] });
	terrs.push({ id: x++, name: 'New Zealand', x: 1240, y: 627, nation: 0, owner: 0, type: 0, water: 0, borders: '133', land: [] });
	terrs.push({ id: x++, name: 'Australia', x: 1080, y: 670, nation: 0, owner: 0, type: 0, water: 0, borders: '129+132', land: [] });
	terrs.push({ id: x++, name: 'India', x: 929, y: 404, nation: 0, owner: 0, type: 0, water: 0, borders: '120+39+29+28+17', land: [39, 17, 29, 28] });
	terrs.push({ id: x++, name: 'Madagascar', x: 778, y: 645, nation: 0, owner: 0, type: 0, water: 0, borders: '122+125+127', land: [] });
	terrs.push({ id: x++, name: 'Mozambique', x: 714, y: 640, nation: 0, owner: 0, type: 0, water: 0, borders: '48+122+49', land: [48, 49] });
	terrs.push({ id: x++, name: 'Angola', x: 638, y: 629, nation: 0, owner: 0, type: 0, water: 0, borders: '42+48+49+95+96', land: [42, 48, 49] });
	terrs.push({ id: x++, name: 'Algeria', x: 577, y: 390, nation: 0, owner: 0, type: 0, water: 0, borders: '114+115+41+45+43', land: [41, 43, 45] });
	terrs.push({ id: x++, name: 'Sierra Leone', x: 502, y: 485, nation: 0, owner: 0, type: 0, water: 0, borders: '97+43+44', land: [43, 44] });
	terrs.push({ id: x++, name: 'Falkland Isls', x: 361, y: 713, nation: 0, owner: 0, type: 0, water: 0, borders: '93', land: [] });
	terrs.push({ id: x++, name: 'Bolivia', x: 334, y: 552, nation: 0, owner: 0, type: 0, water: 0, borders: '54+50+55', land: [50, 54, 55] });
	terrs.push({ id: x++, name: 'Cuba', x: 310, y: 393, nation: 0, owner: 0, type: 0, water: 0, borders: '99', land: [] });
	terrs.push({ id: x++, name: 'Alaska Waters', x: 30, y: 190, nation: 99, owner: 0, type: 0, borders: '144+80+5+81' });
	terrs.push({ id: x++, name: 'Gulf of Alaska', x: 82, y: 185, nation: 99, owner: 0, type: 0, borders: '5+56+79+81+82' });
	terrs.push({ id: x++, name: 'North Pacific Waters', x: 35, y: 315, nation: 99, owner: 0, type: 0, borders: '79+80+82+83+143' });
	terrs.push({ id: x++, name: 'Western USA Waters', x: 96, y: 301, nation: 99, owner: 0, type: 0, borders: '56+80+81+83+85+4' });
	terrs.push({ id: x++, name: 'Hawaii Waters', x: 25, y: 401, nation: 99, owner: 0, type: 0, borders: '81+82+85+6+84+140' });
	terrs.push({ id: x++, name: 'S Hawaii Waters', x: 68, y: 473, nation: 99, owner: 0, type: 0, borders: '83+85+87+136' });
	terrs.push({ id: x++, name: 'W. Mexico Waters', x: 165, y: 441, nation: 99, owner: 0, type: 0, borders: '82+83+84+51+86+87+88' });
	terrs.push({ id: x++, name: 'W. Panama Waters', x: 242, y: 450, nation: 99, owner: 0, type: 0, borders: '85+51+52+99+53+91+88' });
	terrs.push({ id: x++, name: 'South Pacific NW', x: 73, y: 541, nation: 99, owner: 0, type: 0, borders: '85+84+88+90+89+135' });
	terrs.push({ id: x++, name: 'South Pacific NE', x: 190, y: 541, nation: 99, owner: 0, type: 0, borders: '87+85+86+91+92+90' });
	terrs.push({ id: x++, name: 'South Pacific SW', x: 56, y: 669, nation: 99, owner: 0, type: 0, borders: '87+90+133' });
	terrs.push({ id: x++, name: 'South Pacific SE', x: 162, y: 669, nation: 99, owner: 0, type: 0, borders: '87+88+92+89' });
	terrs.push({ id: x++, name: 'Peru Waters', x: 254, y: 546, nation: 99, owner: 0, type: 0, borders: '86+88+92+55+54' });
	terrs.push({ id: x++, name: 'W. Argentina Waters', x: 264, y: 669, nation: 99, owner: 0, type: 0, borders: '88+91+90+93+55' });
	terrs.push({ id: x++, name: 'E. Argentina Waters', x: 400, y: 665, nation: 99, owner: 0, type: 0, borders: '92+55+76+98+94' });
	terrs.push({ id: x++, name: 'South Atlantic', x: 494, y: 677, nation: 99, owner: 0, type: 0, borders: '93+98+97+96+95' });
	terrs.push({ id: x++, name: 'Angola Waters', x: 596, y: 685, nation: 99, owner: 0, type: 0, borders: '96+94+73+123' });
	terrs.push({ id: x++, name: 'Congo Waters', x: 570, y: 576, nation: 99, owner: 0, type: 0, capital: true, homeBase: 42, enemyWater: 93, enemyZone: 55, enemyWater2: 123, enemyZone2: 49, borders: '97+94+95+73+42+44' });
	terrs.push({ id: x++, name: 'Sierra Waters', x: 491, y: 568, nation: 99, owner: 0, type: 0, borders: '98+94+96+75+104' });
	terrs.push({ id: x++, name: 'Brazil Waters', x: 431, y: 598, nation: 99, owner: 0, type: 0, capital: true, homeBase: 50, enemyWater: 114, enemyZone: 8, enemyWater2: 95, enemyZone2: 73, borders: '50+93+94+97+103+104' });
	terrs.push({ id: x++, name: 'Caribbean Sea', x: 354, y: 397, nation: 99, owner: 0, type: 0, borders: '86+100+101+102+103+53+78+52' });
	terrs.push({ id: x++, name: 'Gulf of Mexico', x: 239, y: 357, nation: 99, owner: 0, type: 0, borders: '99+101+52+51+3+2+1' });
	terrs.push({ id: x++, name: 'E USA Waters', x: 342, y: 346, nation: 99, owner: 0, type: 0, capital: true, homeBase: 1, enemyWater: 104, enemyZone: 43, enemyWater2: 105, enemyZone2: 9, borders: '99+100+102+1+106' });
	terrs.push({ id: x++, name: 'North Atlantic N', x: 402, y: 330, nation: 99, owner: 0, type: 0, borders: '106+105+104+103+99+101' });
	terrs.push({ id: x++, name: 'North Atlantic S', x: 405, y: 406, nation: 99, owner: 0, type: 0, borders: '102+104+99+53+98' });
	terrs.push({ id: x++, name: 'West Africa Waters', x: 467, y: 406, nation: 99, owner: 0, type: 0, borders: '103+98+97+43+102+105+114' });
	terrs.push({ id: x++, name: 'Spain Waters', x: 470, y: 329, nation: 99, owner: 0, type: 0, borders: '102+106+109+9+114+104' });
	terrs.push({ id: x++, name: 'Quebec Waters', x: 399, y: 205, nation: 99, owner: 0, type: 0, borders: '101+102+105+109+107+108+58' });
	terrs.push({ id: x++, name: 'Labrador Sea', x: 382, y: 139, nation: 99, owner: 0, type: 0, borders: '108+106+109+59+111' });
	terrs.push({ id: x++, name: 'Hudson Bay', x: 262, y: 167, nation: 99, owner: 0, type: 0, borders: '107+106+58+57' });
	terrs.push({ id: x++, name: 'Denmark Straight', x: 490, y: 207, nation: 99, owner: 0, type: 0, borders: '107+106+9+8+10+105+110+111' });
	terrs.push({ id: x++, name: 'North Sea', x: 588, y: 163, nation: 99, owner: 0, type: 0, capital: true, homeBase: 7, enemyWater: 113, enemyZone: 14, enemyWater2: 106, enemyZone2: 58, borders: '109+111+61+7+10+113' });
	terrs.push({ id: x++, name: 'Norwegian Sea', x: 608, y: 38, nation: 99, owner: 0, type: 0, borders: '110+109+112+60+61+11+107' });
	terrs.push({ id: x++, name: 'Barents Sea', x: 733, y: 30, nation: 99, owner: 0, type: 0, capital: true, homeBase: 13, enemyWater: 111, enemyZone: 60, enemyWater2: 109, enemyZone2: 8, borders: '111+14+13' });
	terrs.push({ id: x++, name: 'Baltic Sea', x: 651, y: 148, nation: 99, owner: 0, type: 0, borders: '110+7+11+14+62' });
	terrs.push({ id: x++, name: 'Mediterraniean W', x: 567, y: 325, nation: 99, owner: 0, type: 0, borders: '105+104+74+115+8+9' });
	terrs.push({ id: x++, name: 'Mediterraniean E', x: 655, y: 340, nation: 99, owner: 0, type: 0, borders: '114+12+116+36+37+118+40+41+74' });
	terrs.push({ id: x++, name: 'Black Sea', x: 724, y: 282, nation: 99, owner: 0, type: 0, borders: '115+12+62+15+63+36' });
	terrs.push({ id: x++, name: 'Caspian Sea', x: 794, y: 299, nation: 99, owner: 0, type: 0, borders: '63+17+38' });
	terrs.push({ id: x++, name: 'Red Sea', x: 742, y: 431, nation: 99, owner: 0, type: 0, capital: true, homeBase: 35, enemyWater: 115, enemyZone: 12, enemyWater2: 120, enemyZone2: 70, borders: '115+121+125+119+47+46+40+37+35' });
	terrs.push({ id: x++, name: 'Arabian Sea', x: 865, y: 448, nation: 99, owner: 0, type: 0, borders: '118+125+126+120+35+37+38' });
	terrs.push({ id: x++, name: 'Bay of Bengal', x: 923, y: 494, nation: 99, owner: 0, type: 0, borders: '119+126+130+131+70+39' });
	terrs.push({ id: x++, name: 'Kenya Waters', x: 779, y: 562, nation: 99, owner: 0, type: 0, borders: '48+47+122+125+118' });
	terrs.push({ id: x++, name: 'Mozambique Channel', x: 739, y: 659, nation: 99, owner: 0, type: 0, borders: '123+127+125+121+72+71' });
	terrs.push({ id: x++, name: 'South African Waters', x: 734, y: 716, nation: 99, owner: 0, type: 0, borders: '95+49+122+124+127' });
	terrs.push({ id: x++, name: 'South Indian Ocean', x: 827, y: 718, nation: 99, owner: 0, type: 0, borders: '123+127+128' });
	terrs.push({ id: x++, name: 'Indian Ocean NW', x: 835, y: 570, nation: 99, owner: 0, type: 0, borders: '118+119+126+128+127+71+122+121' });
	terrs.push({ id: x++, name: 'Indian Ocean NE', x: 917, y: 565, nation: 99, owner: 0, type: 0, borders: '119+120+130+129+128+125' });
	terrs.push({ id: x++, name: 'Indian Ocean SW', x: 832, y: 656, nation: 99, owner: 0, type: 0, borders: '125+128+124+123+122+71' });
	terrs.push({ id: x++, name: 'Indian Ocean SE', x: 913, y: 659, nation: 99, owner: 0, type: 0, borders: '127+125+126+129+124' });
	terrs.push({ id: x++, name: 'Timor Sea', x: 982, y: 607, nation: 99, owner: 0, type: 0, borders: '126+128+130+132+69' });
	terrs.push({ id: x++, name: 'Java Sea', x: 1061, y: 556, nation: 99, owner: 0, type: 0, borders: '126+120+131+134+132+129+34+135' });
	terrs.push({ id: x++, name: 'Gulf of Thailand', x: 1049, y: 459, nation: 99, owner: 0, type: 0, capital: true, homeBase: 28, enemyWater: 119, enemyZone: 38, enemyWater2: 134, enemyZone2: 33, borders: '120+130+134+137+138+28+34' });
	terrs.push({ id: x++, name: 'Coral Sea', x: 1134, y: 607, nation: 99, owner: 0, type: 0, borders: '129+130+69+133+135' });
	terrs.push({ id: x++, name: 'Tasman Sea', x: 1185, y: 627, nation: 99, owner: 0, type: 0, borders: '132+135+68+89' });
	terrs.push({ id: x++, name: 'Celebes Sea', x: 1096, y: 519, nation: 99, owner: 0, type: 0, borders: '130+131+137+33+135' });
	terrs.push({ id: x++, name: 'Bismarck Sea', x: 1237, y: 528, nation: 99, owner: 0, type: 0, borders: '134+137+136+133+132+130+87+67' });
	terrs.push({ id: x++, name: 'Solomon Sea', x: 1237, y: 464, nation: 99, owner: 0, type: 0, borders: '139+140+135+137+66+84' });
	terrs.push({ id: x++, name: 'Philippine Sea', x: 1118, y: 444, nation: 99, owner: 0, type: 0, borders: '131+32+134+138+139+135+136' });
	terrs.push({ id: x++, name: 'South China Sea', x: 1099, y: 369, nation: 99, owner: 0, type: 0, borders: '131+137+139+31+25+141' });
	terrs.push({ id: x++, name: 'Taiwan Waters', x: 1167, y: 381, nation: 99, owner: 0, type: 0, borders: '141+140+136+138+26+137+142' });
	terrs.push({ id: x++, name: 'Marshall Waters', x: 1256, y: 392, nation: 99, owner: 0, type: 0, borders: '27+143+142+139+136+83' });
	terrs.push({ id: x++, name: 'Sea of Japan', x: 1142, y: 290, nation: 99, owner: 0, type: 0, capital: true, homeBase: 21, enemyWater: 137, enemyZone: 32, enemyWater2: 139, enemyZone2: 26, borders: '23+24+21+144+142+139+138' });
	terrs.push({ id: x++, name: 'E Japan Waters', x: 1200, y: 330, nation: 99, owner: 0, type: 0, borders: '21+141+143+140+139+144' });
	terrs.push({ id: x++, name: 'Guam Waters', x: 1250, y: 262, nation: 99, owner: 0, type: 0, borders: '65+142+140+144+81' });
	terrs.push({ id: x++, name: 'Bering Sea', x: 1245, y: 169, nation: 99, owner: 0, type: 0, borders: '22+141+142+143+79' });
	return terrs;
}
function getAllRanks() {
	var x = 0;
	return [
		{ id: x++, name: 'New Recruit', desc: 'New Recruit' }
		, { id: x++, name: 'Private', desc: 'Complete 6 rounds of a Single Player game.' }
		, { id: x++, name: 'Private 1st Class', desc: 'Win Single Player Game' }
		, { id: x++, name: 'Corporal', desc: 'Win a multiplayer game' }
		, { id: x++, name: 'Sergeant', desc: 'Win a 1v1 game with someone ranked Corporal or higher' }
		, { id: x++, name: 'Staff Sergeant', desc: 'Reach 120 points, then host and win a game as a Sergeant' }
		, { id: x++, name: 'Master Sergeant', desc: 'Reach 130 points as a Staff Sergeant and win a game' }
		, { id: x++, name: 'Warrant Officer W1', desc: 'Win a 1v1 game with someone ranked Master Sergeant or higher' }
		, { id: x++, name: 'Warrant Officer W2', desc: 'Reach 150 points as a Warrant Officer and win a game' }
		, { id: x++, name: 'Chief Warrant Officer', desc: 'Win a game that you host, as a Warrant Officer W2' }
		, { id: x++, name: 'Lieutenant', desc: 'Win a 1v1 game against someone ranked Chief Warrant Officer or higher' }
		, { id: x++, name: 'Captain', desc: 'Reach 180 points as a Lieutenant and win a game' }
		, { id: x++, name: 'Major', desc: 'Reach 200 points as a Captain' }
		, { id: x++, name: 'Colonel', desc: 'Reach 220 then Host and win a diplomacy 8 player game' }
		, { id: x++, name: 'Brig General', desc: 'Win a 1v1 game against someone ranked Colonel or higher' }
		, { id: x++, name: 'Major General', desc: 'reach 270 points as a Brig General' }
		, { id: x++, name: 'Lieutenant General', desc: 'Reach 300 pts then host and win a 6-8-player FFA game' }
		, { id: x++, name: '4-Star General', desc: 'Win a 1v1 game against someone ranked Lieutenant General or higher' }
		, { id: x++, name: 'Grand General', desc: 'Highest Ranking General' }
		, { id: x++, name: 'Grand General2', desc: 'Highest Ranking General2' }
	];
}
function awardNameForNum(num) {
	var names = [
		'Grand General Reached',
		'8-man FFA Game Won',
		'8-man Diplomacy Game Won',
		'8-man Firefight Game Won',
		'8-man Barbarian Game Won',
		'5 Games Won',
		'10 Games Won',
		'25 Games Won',
		'50 Games Won',
		'3 Game Win Streak',
		'5 Game Win Streak',
		'7 Game Win Streak',
		'9 Game Win Streak',
		'First Player to 5 Wins',
		'First Player to 10 Wins',
		'First Player to 25 Wins',
		'First Player to 50 Wins',
		'8-man Co-Op Game Won',
	];
	return names[num - 1];
}
function cargoSpaceForPiece(piece) {
	if (piece.id == 4 || piece.id == 8 || piece.id == 45)
		return 45;
	if (piece.id == 49)
		return 15;
	if (piece.subType == "ship")
		return 2;
	if (piece.subType == "bomber" || piece.id == 50)
		return 22;
	return 0;
}
function cargoUnitsForPiece(piece) {
	if (piece.subType == "hero" || piece.subType == "aa")
		return 1;
	if (piece.subType == "soldier")
		return 10;
	if (piece.subType == "vehicle")
		return 20;
	if (piece.subType == "fighter")
		return 20;
	if (piece.subType == "missile")
		return 20;
	return 0;
}
function leagueNames() {
	return ['None', 'Bronze', 'Silver', 'Gold', 'Platinum'];
}
function getGameTypes(limitedFlg, num) {
	if (limitedFlg)
		return ['diplomacy', 'locked', 'firefight', 'hungerGames', 'freeforall'];
	else {
		if (num == 1)
			return ['diplomacy', 'firefight', 'hungerGames'];
		if (num == 2)
			return ['locked', 'autobalance', 'barbarian', 'battlebots', 'co-op'];
		if (num == 3)
			return ['freeforall', 'ffa-5', 'ffa-6', 'ffa-7'];

		return ['diplomacy', 'locked', 'autobalance', 'firefight', 'battlebots', 'barbarian', 'hungerGames', 'freeforall', 'ffa-5', 'ffa-6', 'ffa-7', 'co-op'];
	}
}
function getGameTypesObj(limitedFlg, num) {
	var gTypes = getGameTypes(limitedFlg, num);
	var obj = [];
	var id = 0;
	gTypes.forEach(function (type) {
		obj.push({ id: id++, type: type, name: gameTypeNameForType(type), desc: gameDescForType(type), win: pointsForType(type, true), loss: pointsForType(type, false), icon: ngClassGameTypeMain(type) });
	});
	return obj;
}
function allowAlliancesForType(type) {
	if (type == 'freeforall' || type == 'basicTraining' || type == 'locked' || type == 'autobalance' || type == 'ffa-5' || type == 'ffa-6' || type == 'ffa-7')
		return false;
	else
		return true;
}
function maxAlliesForType(type, numPlayers) {
	if (type == 'hungerGames')
		return 1;
	if (type == 'co-op')
		return 5;
	if (type == 'firefight')
		return 2;
	if (type == 'barbarian')
		return 2;
	if (type == 'battlebots')
		return 1;
	if (type == 'freeforall' || type == 'basicTraining' || type == 'ffa-5' || type == 'ffa-6' || type == 'ffa-7')
		return 0;
	if (type == 'locked' || type == 'autobalance')
		return numPlayers;
	return parseInt(numPlayers / 2) - 1;
}
function gameTypeNameForType(type) {
	if (type == 'diplomacy')
		return 'Diplomacy';
	if (type == 'firefight')
		return 'Fire-Fight';
	if (type == 'locked')
		return 'Locked';
	if (type == 'freeforall')
		return 'Free-For-All';
	if (type == 'hungerGames')
		return 'Hunger-Games';
	if (type == 'barbarian')
		return 'Barbarian';
	if (type == 'co-op')
		return 'Co-op';
	if (type == 'autobalance')
		return 'Auto-balanced';
	if (type == 'battlebots')
		return 'Battle-Bots';
	if (type == 'basicTraining')
		return 'Basic Training';
	if (type == 'ffa-5')
		return 'FFA-5';
	if (type == 'ffa-6')
		return 'FFA-6';
	if (type == 'ffa-7')
		return 'FFA-7';
	return type;
}
function ngClassGameTypeMain(gameType) {
	if (gameType == 'hungerGames')
		return 'fa fa-cutlery';
	if (gameType == 'diplomacy')
		return 'fa fa-handshake-o';
	if (gameType == 'autobalance')
		return 'fa fa-balance-scale';
	if (gameType == 'firefight')
		return 'fa fa-fire';
	if (gameType == 'barbarian')
		return 'fa fa-star';
	if (gameType == 'freeforall')
		return 'fa fa-user';
	if (gameType == 'co-op')
		return 'fa fa-users';
	if (gameType == 'locked')
		return 'fa fa-lock';
	if (gameType == 'battlebots')
		return 'fa fa-android';
	if (gameType == 'ffa-5')
		return 'fa fa-bolt';
	if (gameType == 'ffa-6')
		return 'fa fa-bolt';
	if (gameType == 'ffa-7')
		return 'fa fa-bolt';
	return 'fa fa-check';
}
function numPlayersPerType(gameType) {
	if (gameType == 'hungerGames')
		return { min: '8', max: '8' };
	if (gameType == 'diplomacy')
		return { min: '2', max: '8' };
	if (gameType == 'autobalance')
		return { min: '6', max: '8' };
	if (gameType == 'firefight')
		return { min: '8', max: '8' };
	if (gameType == 'barbarian')
		return { min: '8', max: '8' };
	if (gameType == 'freeforall')
		return { min: '2', max: '8' };
	if (gameType == 'co-op')
		return { min: '3', max: '3' };
	if (gameType == 'locked')
		return { min: '3', max: '8' };
	if (gameType == 'battlebots')
		return { min: '4', max: '4' };
	if (gameType == 'ffa-5')
		return { min: '5', max: '5' };
	if (gameType == 'ffa-6')
		return { min: '6', max: '6' };
	if (gameType == 'ffa-7')
		return { min: '7', max: '7' };
	return '8';
}
function gamePointsForType(type, mmFlg) {
	var wPts = pointsForType(type, true);
	var lPts = pointsForType(type, false);
	if (!mmFlg)
		lPts = 0;
	var points = (wPts == 1) ? "point" : "points";
	return wPts + " " + points + " for win, " + lPts + " for loss";
}
function pointsForType(type, winFlg) {
	if (type == 'diplomacy')
		return (winFlg) ? 2 : -2;
	if (type == 'firefight')
		return (winFlg) ? 3 : -1;
	if (type == 'locked')
		return (winFlg) ? 2 : -2;
	if (type == 'freeforall')
		return (winFlg) ? 8 : -1;
	if (type == 'hungerGames')
		return (winFlg) ? 4 : -1;
	if (type == 'barbarian')
		return (winFlg) ? 4 : -2;
	if (type == 'co-op')
		return (winFlg) ? 1 : -2;
	if (type == 'autobalance')
		return (winFlg) ? 2 : -2;
	if (type == 'battlebots')
		return (winFlg) ? 4 : -1;
	if (type == 'basicTraining')
		return (winFlg) ? 0 : 0;
	if (type == 'ffa-5')
		return (winFlg) ? 5 : -1;
	if (type == 'ffa-6')
		return (winFlg) ? 6 : -1;
	if (type == 'ffa-7')
		return (winFlg) ? 7 : -1;
	return type;
}
function gameTypeForName(type) {
	if (type == 'Diplomacy')
		return 'diplomacy';
	if (type == 'Fire-Fight')
		return 'firefight';
	if (type == 'Locked')
		return 'locked';
	if (type == 'Free-For-All')
		return 'freeforall';
	if (type == 'Hunger-Games')
		return 'hungerGames';
	if (type == 'Barbarian')
		return 'barbarian';
	if (type == 'Co-op')
		return 'co-op';
	if (type == 'Auto-balanced')
		return 'autobalance';
	if (type == 'Battle-Bots')
		return 'battlebots';
	if (type == 'Basic Training')
		return 'basicTraining';
	if (type == 'FFA-5')
		return 'ffa-5';
	if (type == 'FFA-6')
		return 'ffa-6';
	if (type == 'FFA-7')
		return 'ffa-7';
	return type;
}
function gameDescForType(type) {
	if (type == 'basicTraining')
		return "Conquer the capitals of Russia and Indo-China before Japan does.";
	if (type == 'diplomacy')
		return "This game starts with no teams, but you are able to offer peace treaties and alliances to other players as the game progresses. The first team to capture 6 of the original 8 capitals and hold them all for 1 complete turn wins the game!";
	if (type == 'firefight')
		return "Chaos teams. 8 Player game with teams of 3, meaning some players will be left off a team. There will be diplomacy.";
	if (type == 'locked' || type == 'teams')
		return "Teams are determined at the start and set for the entire game.";
	if (type == 'freeforall')
		return "This is a free-for-all game. There are no teams, so the first player to capture 6 of the original 8 capitals and hold them all for 1 complete round wins the game. You are still free to offer peace treaties to other players, just no alliances.";
	if (type == 'ffa-5')
		return "Free-for-all game with 5 humans and 3 bots. No Teams.";
	if (type == 'ffa-6')
		return "Free-for-all game with 6 humans and 2 bots. No Teams.";
	if (type == 'ffa-7')
		return "Free-for-all game with 7 humans and 1 bot. No Teams.";
	if (type == 'duo_diplomacy' || type == 'hungerGames')
		return "Diplomacy style game with four teams of 2. You must work with your teammate and with other teams, hoping to be the last team standing.";
	if (type == 'training')
		return "Through use of your military, take over Russia and Indo-China before the computer does! <img src=../graphics/pics/objectives.JPG border=1 width=200>";
	if (type == 'barbarian')
		return "Roman Empire vs barbarian tribes. Teams are locked in this game with a single team of 3 and 5 individual players who cannot ally with anyone.";
	if (type == 'co-op')
		return "Three humans teamed up against 5 computer opponents.";
	if (type == 'autobalance')
		return "Locked teams that are auto-balanced based on rank.";
	if (type == 'locked')
		return "Teams are set from the beginning.";
	if (type == 'battlebots')
		return "4 humans and 4 bots. Each human player is teamed up with a bot.";
}
