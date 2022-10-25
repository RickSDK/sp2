function getGameTerritoriesAA() {
	var terrs = [];
	var x = 1;
	terrs.push({ id: x++, name: 'Eastern USA', x: 54, y: 329, nation: 1, owner: 1, type: 0, capital: true, water: 101, land: [56, 10], enemyWater: 1, enemyZone: 1, enemyWater2: 1, enemyZone2: 1, borders: '56+10+72' });
	terrs.push({ id: x++, name: 'West Indies', x: 104, y: 401, nation: 1, owner: 1, type: 0, water: 0, borders: '79', land: [] });
	terrs.push({ id: x++, name: 'Panama', x: 33, y: 425, nation: 1, owner: 1, type: 0, water: 0, borders: '57+11+79+84', land: [57,11] });
	terrs.push({ id: x++, name: 'Brazil', x: 152, y: 532, nation: 1, owner: 1, type: 0, water: 0, borders: '57+58+59+80+82', land: [57,58,59] });
	terrs.push({ id: x++, name: 'Sinkiang', x: 714, y: 293, nation: 1, owner: 1, type: 0, borders: '15+16+67+6+31+52+66', land: [15,16,67,6,31,52,66] });
	terrs.push({ id: x++, name: 'China', x: 777, y: 311, nation: 1, owner: 1, type: 0, borders: '2+1' });
	terrs.push({ id: x++, name: 'Alaska', x: 1069, y: 109, nation: 1, owner: 1, type: 0, borders: '2+1' });
	terrs.push({ id: x++, name: 'Midway Island', x: 1068, y: 275, nation: 1, owner: 1, type: 0, borders: '2+1' });
	terrs.push({ id: x++, name: 'HawaiianIslands', x: 1114, y: 399, nation: 1, owner: 1, type: 0, borders: '2+1' });
	terrs.push({ id: x++, name: 'Western USA', x: 1190, y: 270, nation: 1, owner: 1, type: 0, borders: '2+1' });
	terrs.push({ id: x++, name: 'Mexico', x: 1213, y: 363, nation: 1, owner: 1, type: 0, borders: '2+1' });
	terrs.push({ id: x++, name: 'Russia', x: 608, y: 138, nation: 3, owner: 3, type: 0, capital: true, borders: '2+1' });
	terrs.push({ id: x++, name: 'Karelia SSR', x: 537, y: 86, nation: 3, owner: 3, type: 0, capital: false, borders: '2+1' });
	terrs.push({ id: x++, name: 'Caucasus', x: 540, y: 194, nation: 3, owner: 3, type: 0, capital: false, borders: '2+1' });
	terrs.push({ id: x++, name: 'Kazak SSR', x: 609, y: 254, nation: 3, owner: 3, type: 0, capital: false, borders: '2+1' });
	terrs.push({ id: x++, name: 'Novosibirsk', x: 677, y: 219, nation: 3, owner: 3, type: 0, capital: false, borders: '2+1' });
	terrs.push({ id: x++, name: 'Evenki', x: 729, y: 107, nation: 3, owner: 3, type: 0, capital: false, borders: '2+1' });
	terrs.push({ id: x++, name: 'Yakut SSR', x: 812, y: 163, nation: 3, owner: 3, type: 0, capital: false, borders: '2+1' });
	terrs.push({ id: x++, name: 'Soviet Far East', x: 884, y: 125, nation: 3, owner: 3, type: 0, capital: false, borders: '2+1' });
	terrs.push({ id: x++, name: 'Germany', x: 388, y: 204, nation: 2, owner: 2, type: 0, capital: true, borders: '2+1' });
	terrs.push({ id: x++, name: 'Western Europe', x: 334, y: 228, nation: 2, owner: 2, type: 0, capital: false, borders: '2+1' });
	terrs.push({ id: x++, name: 'Eastern Europe', x: 453, y: 214, nation: 2, owner: 2, type: 0, capital: false, borders: '2+1' });
	terrs.push({ id: x++, name: 'Ukraine', x: 500, y: 178, nation: 2, owner: 2, type: 0, capital: false, borders: '2+1' });
	terrs.push({ id: x++, name: 'Finland Norway', x: 413, y: 71, nation: 2, owner: 2, type: 0, capital: false, borders: '2+1' });
	terrs.push({ id: x++, name: 'Southern Europe', x: 405, y: 264, nation: 2, owner: 2, type: 0, capital: false, borders: '2+1' });
	terrs.push({ id: x++, name: 'Angeria', x: 328, y: 355, nation: 2, owner: 2, type: 0, capital: false, borders: '2+1' });
	terrs.push({ id: x++, name: 'Libya', x: 399, y: 384, nation: 2, owner: 2, type: 0, capital: false, borders: '2+1' });
	terrs.push({ id: x++, name: 'Japan', x: 938, y: 314, nation: 4, owner: 4, type: 0, capital: true, borders: '2+1' });
	terrs.push({ id: x++, name: 'Manchuria', x: 867, y: 228, nation: 4, owner: 4, type: 0, capital: false, borders: '2+1' });
	terrs.push({ id: x++, name: 'Kwangtung', x: 826, y: 326, nation: 4, owner: 4, type: 0, capital: false, borders: '2+1' });
	terrs.push({ id: x++, name: 'Indo-China', x: 757, y: 398, nation: 4, owner: 4, type: 0, capital: false, borders: '2+1' });
	terrs.push({ id: x++, name: 'East Indies', x: 751, y: 513, nation: 4, owner: 4, type: 0, capital: false, borders: '2+1' });
	terrs.push({ id: x++, name: 'Philippines', x: 851, y: 428, nation: 4, owner: 4, type: 0, capital: false, borders: '2+1' });
	terrs.push({ id: x++, name: 'Borneo', x: 829, y: 499, nation: 4, owner: 4, type: 0, capital: false, borders: '2+1' });
	terrs.push({ id: x++, name: 'Okinawa', x: 919, y: 379, nation: 4, owner: 4, type: 0, capital: false, borders: '2+1' });
	terrs.push({ id: x++, name: 'Carolina Isls', x: 946, y: 453, nation: 4, owner: 4, type: 0, capital: false, borders: '2+1' });
	terrs.push({ id: x++, name: 'New Guinea', x: 922, y: 543, nation: 4, owner: 4, type: 0, capital: false, borders: '2+1' });
	terrs.push({ id: x++, name: 'Wake Island', x: 991, y: 379, nation: 4, owner: 4, type: 0, capital: false, borders: '2+1' });
	terrs.push({ id: x++, name: 'Solomon Islands', x: 1006, y: 553, nation: 4, owner: 4, type: 0, capital: false, borders: '2+1' });
	terrs.push({ id: x++, name: 'UK', x: 327, y: 165, nation: 7, owner: 7, type: 0, capital: true, borders: '2+1' });
	terrs.push({ id: x++, name: 'Gibralter', x: 290, y: 325, nation: 7, owner: 7, type: 0, capital: false, borders: '2+1' });
	terrs.push({ id: x++, name: 'West Africa', x: 300, y: 441, nation: 7, owner: 7, type: 0, capital: false, borders: '2+1' });
	terrs.push({ id: x++, name: 'Central Africa', x: 382, y: 462, nation: 7, owner: 7, type: 0, capital: false, borders: '2+1' });
	terrs.push({ id: x++, name: 'Egypt Sudan', x: 457, y: 408, nation: 7, owner: 7, type: 0, capital: false, borders: '2+1' });
	terrs.push({ id: x++, name: 'East Africa', x: 531, y: 491, nation: 7, owner: 7, type: 0, capital: false, borders: '2+1' });
	terrs.push({ id: x++, name: 'Congo', x: 431, y: 531, nation: 7, owner: 7, type: 0, capital: false, borders: '2+1' });
	terrs.push({ id: x++, name: 'Kenya', x: 485, y: 552, nation: 7, owner: 7, type: 0, capital: false, borders: '2+1' });
	terrs.push({ id: x++, name: 'South Africa', x: 449, y: 656, nation: 7, owner: 7, type: 0, capital: false, borders: '2+1' });
	terrs.push({ id: x++, name: 'Madagascar', x: 536, y: 664, nation: 7, owner: 7, type: 0, capital: false, borders: '2+1' });
	terrs.push({ id: x++, name: 'Sryia Iraq', x: 506, y: 349, nation: 7, owner: 7, type: 0, capital: false, borders: '2+1' });
	terrs.push({ id: x++, name: 'Persia', x: 567, y: 321, nation: 7, owner: 7, type: 0, capital: false, borders: '2+1' });
	terrs.push({ id: x++, name: 'India', x: 667, y: 364, nation: 7, owner: 7, type: 0, capital: false, borders: '2+1' });
	terrs.push({ id: x++, name: 'Australia', x: 833, y: 650, nation: 7, owner: 7, type: 0, capital: false, borders: '2+1' });
	terrs.push({ id: x++, name: 'New Zealand', x: 1023, y: 685, nation: 7, owner: 7, type: 0, capital: false, borders: '2+1' });
	terrs.push({ id: x++, name: 'West Canada', x: 1222, y: 162, nation: 7, owner: 7, type: 0, capital: false, borders: '2+1' });
	terrs.push({ id: x++, name: 'East Canada', x: 119, y: 208, nation: 7, owner: 7, type: 0, capital: false, borders: '2+1' });
	terrs.push({ id: x++, name: 'Venezuela', x: 70, y: 476, nation: 0, owner: 0, type: 0, capital: false, borders: '2+1' });
	terrs.push({ id: x++, name: 'peru', x: 76, y: 551, nation: 0, owner: 0, type: 0, capital: false, borders: '2+1' });
	terrs.push({ id: x++, name: 'Argentina', x: 105, y: 607, nation: 0, owner: 0, type: 0, capital: false, borders: '2+1' });
	terrs.push({ id: x++, name: 'Spain', x: 291, y: 281, nation: 0, owner: 0, type: 0, capital: false, borders: '2+1' });
	terrs.push({ id: x++, name: 'Eire', x: 271, y: 152, nation: 0, owner: 0, type: 0, capital: false, borders: '2+1' });
	terrs.push({ id: x++, name: 'Sweden', x: 396, y: 143, nation: 0, owner: 0, type: 0, capital: false, borders: '2+1' });
	terrs.push({ id: x++, name: 'Turkey', x: 497, y: 303, nation: 0, owner: 0, type: 0, capital: false, borders: '2+1' });
	terrs.push({ id: x++, name: 'Saudi Arabia', x: 554, y: 407, nation: 0, owner: 0, type: 0, capital: false, borders: '2+1' });
	terrs.push({ id: x++, name: 'Angola', x: 415, y: 616, nation: 0, owner: 0, type: 0, capital: false, borders: '2+1' });
	terrs.push({ id: x++, name: 'Afghan', x: 631, y: 316, nation: 0, owner: 0, type: 0, capital: false, borders: '2+1' });
	terrs.push({ id: x++, name: 'Mongolia', x: 772, y: 228, nation: 0, owner: 0, type: 0, capital: false, borders: '2+1' });
	terrs.push({ id: x++, name: 'North Atlantic', x: 165, y: 131, nation: 99, owner: 0, type: 0, capital: false, borders: '2+1' });
	terrs.push({ id: x++, name: 'Actic West', x: 345, y: 52, nation: 99, owner: 0, type: 0, capital: false, borders: '2+1' });
	terrs.push({ id: x++, name: 'Actic East', x: 491, y: 33, nation: 99, owner: 0, type: 0, capital: false, borders: '2+1' });
	terrs.push({ id: x++, name: 'Inlet', x: 410, y: 159, nation: 99, owner: 0, type: 0, capital: false, borders: '2+1' });
	terrs.push({ id: x++, name: 'USA Waters', x: 112, y: 345, nation: 99, owner: 0, type: 0, capital: false, borders: '2+1' });
	terrs.push({ id: x++, name: 'Central Altantic', x: 180, y: 354, nation: 99, owner: 0, type: 0, capital: false, borders: '2+1' });
	terrs.push({ id: x++, name: 'Spain Waters', x: 239, y: 251, nation: 99, owner: 0, type: 0, capital: false, borders: '2+1' });
	terrs.push({ id: x++, name: 'Gibralter Straight', x: 338, y: 311, nation: 99, owner: 0, type: 0, capital: false, borders: '2+1' });
	terrs.push({ id: x++, name: 'Mediteranean', x: 416, y: 333, nation: 99, owner: 0, type: 0, capital: false, borders: '2+1' });
	terrs.push({ id: x++, name: 'Med East', x: 469, y: 338, nation: 99, owner: 0, type: 0, capital: false, borders: '2+1' });
	terrs.push({ id: x++, name: 'Black Sea', x: 492, y: 266, nation: 99, owner: 0, type: 0, capital: false, borders: '2+1' });
	terrs.push({ id: x++, name: 'Panama East Waters', x: 113, y: 439, nation: 99, owner: 0, type: 0, capital: false, borders: '2+1' });
	terrs.push({ id: x++, name: 'Brazil North Waters', x: 180, y: 459, nation: 99, owner: 0, type: 0, capital: false, borders: '2+1' });
	terrs.push({ id: x++, name: 'West Africa Waters', x: 236, y: 476, nation: 99, owner: 0, type: 0, capital: false, borders: '2+1' });
	terrs.push({ id: x++, name: 'Brazil South Waters', x: 217, y: 573, nation: 99, owner: 0, type: 0, capital: false, borders: '2+1' });
	terrs.push({ id: x++, name: 'Congo Waters', x: 333, y: 540, nation: 99, owner: 0, type: 0, capital: false, borders: '2+1' });
	terrs.push({ id: x++, name: 'West Panama Waters', x: 21, y: 465, nation: 99, owner: 0, type: 0, capital: false, borders: '2+1' });
	terrs.push({ id: x++, name: 'Peru Waters', x: 32, y: 587, nation: 99, owner: 0, type: 0, capital: false, borders: '2+1' });
	terrs.push({ id: x++, name: 'South Argentina Waters', x: 141, y: 713, nation: 99, owner: 0, type: 0, capital: false, borders: '2+1' });
	terrs.push({ id: x++, name: 'Mid South Atlantic', x: 278, y: 650, nation: 99, owner: 0, type: 0, capital: false, borders: '2+1' });
	terrs.push({ id: x++, name: 'South Atlantic', x: 281, y: 723, nation: 99, owner: 0, type: 0, capital: false, borders: '2+1' });
	terrs.push({ id: x++, name: 'Angola Waters', x: 364, y: 678, nation: 99, owner: 0, type: 0, capital: false, borders: '2+1' });
	terrs.push({ id: x++, name: 'East Argintina Waters', x: 170, y: 639, nation: 99, owner: 0, type: 0, capital: false, borders: '2+1' });
	terrs.push({ id: x++, name: 'Red Sea', x: 579, y: 489, nation: 99, owner: 0, type: 0, capital: false, borders: '2+1' });
	terrs.push({ id: x++, name: 'Indian Ocean', x: 629, y: 458, nation: 99, owner: 0, type: 0, capital: false, borders: '2+1' });
	terrs.push({ id: x++, name: 'East Africa Waters', x: 533, y: 572, nation: 99, owner: 0, type: 0, capital: false, borders: '2+1' });
	terrs.push({ id: x++, name: 'South Africa Waters', x: 483, y: 718, nation: 99, owner: 0, type: 0, capital: false, borders: '2+1' });
	terrs.push({ id: x++, name: 'Indian Ocean NW', x: 589, y: 564, nation: 99, owner: 0, type: 0, capital: false, borders: '2+1' });
	terrs.push({ id: x++, name: 'Indian Ocean NE', x: 683, y: 536, nation: 99, owner: 0, type: 0, capital: false, borders: '2+1' });
	terrs.push({ id: x++, name: 'Indian Ocean SW', x: 580, y: 729, nation: 99, owner: 0, type: 0, capital: false, borders: '2+1' });
	terrs.push({ id: x++, name: 'Indian Ocean SE', x: 680, y: 729, nation: 99, owner: 0, type: 0, capital: false, borders: '2+1' });
	terrs.push({ id: x++, name: 'Indo-China Waters', x: 797, y: 461, nation: 99, owner: 0, type: 0, capital: false, borders: '2+1' });
	terrs.push({ id: x++, name: 'East Indies Waters', x: 733, y: 547, nation: 99, owner: 0, type: 0, capital: false, borders: '2+1' });
	terrs.push({ id: x++, name: 'Australia West', x: 762, y: 592, nation: 99, owner: 0, type: 0, capital: false, borders: '2+1' });
	terrs.push({ id: x++, name: 'Australia South', x: 831, y: 720, nation: 99, owner: 0, type: 0, capital: false, borders: '2+1' });
	terrs.push({ id: x++, name: 'Australia East', x: 940, y: 591, nation: 99, owner: 0, type: 0, capital: false, borders: '2+1' });
	terrs.push({ id: x++, name: 'New Zealand', x: 1036, y: 610, nation: 99, owner: 0, type: 0, capital: false, borders: '2+1' });
	terrs.push({ id: x++, name: 'Pacific South', x: 1107, y: 497, nation: 99, owner: 0, type: 0, capital: false, borders: '2+1' });
	terrs.push({ id: x++, name: 'Pacific SE', x: 1219, y: 544, nation: 99, owner: 0, type: 0, capital: false, borders: '2+1' });
	terrs.push({ id: x++, name: 'Borneo', x: 849, y: 530, nation: 99, owner: 0, type: 0, capital: false, borders: '2+1' });
	terrs.push({ id: x++, name: 'New Guinea', x: 949, y: 510, nation: 99, owner: 0, type: 0, capital: false, borders: '2+1' });
	terrs.push({ id: x++, name: 'Solomon', x: 1020, y: 490, nation: 99, owner: 0, type: 0, capital: false, borders: '2+1' });
	terrs.push({ id: x++, name: 'Hawaii', x: 1059, y: 371, nation: 99, owner: 0, type: 0, capital: false, borders: '2+1' });
	terrs.push({ id: x++, name: 'Mexico', x: 1210, y: 452, nation: 99, owner: 0, type: 0, capital: false, borders: '2+1' });
	terrs.push({ id: x++, name: 'Gulf', x: 1265, y: 363, nation: 99, owner: 0, type: 0, capital: false, borders: '2+1' });
	terrs.push({ id: x++, name: 'China Sea', x: 856, y: 351, nation: 99, owner: 0, type: 0, capital: false, borders: '2+1' });
	terrs.push({ id: x++, name: 'Philipeans', x: 872, y: 387, nation: 99, owner: 0, type: 0, capital: false, borders: '2+1' });
	terrs.push({ id: x++, name: 'Caroline', x: 909, y: 434, nation: 99, owner: 0, type: 0, capital: false, borders: '2+1' });
	terrs.push({ id: x++, name: 'Oak', x: 944, y: 371, nation: 99, owner: 0, type: 0, capital: false, borders: '2+1' });
	terrs.push({ id: x++, name: 'Wake', x: 1010, y: 413, nation: 99, owner: 0, type: 0, capital: false, borders: '2+1' });
	terrs.push({ id: x++, name: 'Japan', x: 967, y: 253, nation: 99, owner: 0, type: 0, capital: false, borders: '2+1' });
	terrs.push({ id: x++, name: 'N Pacific', x: 1018, y: 296, nation: 99, owner: 0, type: 0, capital: false, borders: '2+1' });
	terrs.push({ id: x++, name: 'Midway', x: 1075, y: 226, nation: 99, owner: 0, type: 0, capital: false, borders: '2+1' });
	terrs.push({ id: x++, name: 'W. USA', x: 1123, y: 266, nation: 99, owner: 0, type: 0, capital: false, borders: '2+1' });
	terrs.push({ id: x++, name: 'Far East', x: 933, y: 167, nation: 99, owner: 0, type: 0, capital: false, borders: '2+1' });
	terrs.push({ id: x++, name: 'Alaska', x: 1014, y: 163, nation: 99, owner: 0, type: 0, capital: false, borders: '2+1' });
	terrs.push({ id: x++, name: 'Gulf Alaska', x: 1093, y: 185, nation: 99, owner: 0, type: 0, capital: false, borders: '2+1' });
	return terrs;
}
function loadAAGameUnits(pieces, players, territories) {
	console.log('xxxloadAAGameUnits');
	var units = [];
	var id = 1;
	//Russia
	units.push(unitOfId(id++, 3, 2, 12, pieces));
	units.push(unitOfId(id++, 3, 2, 12, pieces));
	units.push(unitOfId(id++, 3, 2, 12, pieces));
	units.push(unitOfId(id++, 3, 1, 12, pieces));
	units.push(unitOfId(id++, 3, 3, 12, pieces));
	units.push(unitOfId(id++, 3, 3, 12, pieces));
	units.push(unitOfId(id++, 3, 6, 12, pieces));
	units.push(unitOfId(id++, 3, 13, 12, pieces));
	units.push(unitOfId(id++, 3, 15, 12, pieces));
	//karelia
	units.push(unitOfId(id++, 3, 2, 13, pieces));
	units.push(unitOfId(id++, 3, 2, 13, pieces));
	units.push(unitOfId(id++, 3, 2, 13, pieces));
	units.push(unitOfId(id++, 3, 6, 13, pieces));
	//Caucasus
	units.push(unitOfId(id++, 3, 2, 14, pieces));
	units.push(unitOfId(id++, 3, 2, 14, pieces));
	units.push(unitOfId(id++, 3, 2, 14, pieces));
	units.push(unitOfId(id++, 3, 3, 14, pieces));
	units.push(unitOfId(id++, 3, 13, 14, pieces));
	units.push(unitOfId(id++, 3, 15, 14, pieces));
	//Kazak
	units.push(unitOfId(id++, 3, 2, 15, pieces));
	units.push(unitOfId(id++, 3, 2, 15, pieces));
	//nov
	units.push(unitOfId(id++, 3, 2, 16, pieces));
	units.push(unitOfId(id++, 3, 2, 16, pieces));
	//evenki
	units.push(unitOfId(id++, 3, 2, 17, pieces));
	units.push(unitOfId(id++, 3, 2, 17, pieces));
	//yakut
	units.push(unitOfId(id++, 3, 2, 18, pieces));
	units.push(unitOfId(id++, 3, 2, 18, pieces));
	//far east
	units.push(unitOfId(id++, 3, 2, 19, pieces));
	units.push(unitOfId(id++, 3, 2, 19, pieces));

	//Germany
	units.push(unitOfId(id++, 2, 15, 20, pieces));
	units.push(unitOfId(id++, 2, 2, 20, pieces));
	units.push(unitOfId(id++, 2, 2, 20, pieces));
	units.push(unitOfId(id++, 2, 2, 20, pieces));
	units.push(unitOfId(id++, 2, 3, 20, pieces));
	units.push(unitOfId(id++, 2, 3, 20, pieces));
	units.push(unitOfId(id++, 2, 6, 20, pieces));
	units.push(unitOfId(id++, 2, 7, 20, pieces));
	units.push(unitOfId(id++, 2, 13, 20, pieces));
	// w europe
	units.push(unitOfId(id++, 2, 2, 21, pieces));
	units.push(unitOfId(id++, 2, 2, 21, pieces));
	units.push(unitOfId(id++, 2, 3, 21, pieces));
	units.push(unitOfId(id++, 2, 3, 21, pieces));
	units.push(unitOfId(id++, 2, 6, 21, pieces));
	units.push(unitOfId(id++, 2, 13, 21, pieces));
	//norway
	units.push(unitOfId(id++, 2, 2, 24, pieces));
	units.push(unitOfId(id++, 2, 2, 24, pieces));
	units.push(unitOfId(id++, 2, 2, 24, pieces));
	units.push(unitOfId(id++, 2, 6, 24, pieces));
	//s europe
	units.push(unitOfId(id++, 2, 2, 25, pieces));
	units.push(unitOfId(id++, 2, 2, 25, pieces));
	units.push(unitOfId(id++, 2, 1, 25, pieces));
	units.push(unitOfId(id++, 2, 3, 25, pieces));
	units.push(unitOfId(id++, 2, 13, 25, pieces));
	units.push(unitOfId(id++, 2, 15, 25, pieces));
	//e europe
	units.push(unitOfId(id++, 2, 2, 22, pieces));
	units.push(unitOfId(id++, 2, 2, 22, pieces));
	units.push(unitOfId(id++, 2, 3, 22, pieces));
	units.push(unitOfId(id++, 2, 6, 22, pieces));
	//ukraine
	units.push(unitOfId(id++, 2, 2, 23, pieces));
	units.push(unitOfId(id++, 2, 2, 23, pieces));
	units.push(unitOfId(id++, 2, 2, 23, pieces));
	units.push(unitOfId(id++, 2, 1, 23, pieces));
	units.push(unitOfId(id++, 2, 3, 23, pieces));
	units.push(unitOfId(id++, 2, 6, 23, pieces));
	//algeria
	units.push(unitOfId(id++, 2, 2, 26, pieces));
	units.push(unitOfId(id++, 2, 1, 26, pieces));
	//libya
	units.push(unitOfId(id++, 2, 2, 27, pieces));
	units.push(unitOfId(id++, 2, 3, 27, pieces));


	//UK
	units.push(unitOfId(id++, 7, 15, 40, pieces));
	units.push(unitOfId(id++, 7, 2, 40, pieces));
	units.push(unitOfId(id++, 7, 2, 40, pieces));
	units.push(unitOfId(id++, 7, 1, 40, pieces));
	units.push(unitOfId(id++, 7, 3, 40, pieces));
	units.push(unitOfId(id++, 7, 6, 40, pieces));
	units.push(unitOfId(id++, 7, 6, 40, pieces));
	units.push(unitOfId(id++, 7, 7, 40, pieces));
	units.push(unitOfId(id++, 7, 13, 40, pieces));
	//E canada
	units.push(unitOfId(id++, 7, 3, 56, pieces));
	//w canada
	units.push(unitOfId(id++, 7, 2, 55, pieces));
	//new zealand
	units.push(unitOfId(id++, 7, 2, 54, pieces));
	//australia
	units.push(unitOfId(id++, 7, 2, 53, pieces));
	units.push(unitOfId(id++, 7, 2, 53, pieces));
	units.push(unitOfId(id++, 7, 2, 53, pieces));
	//india
	units.push(unitOfId(id++, 7, 2, 52, pieces));
	units.push(unitOfId(id++, 7, 2, 52, pieces));
	units.push(unitOfId(id++, 7, 2, 52, pieces));
	units.push(unitOfId(id++, 7, 13, 52, pieces));
	//persia
	units.push(unitOfId(id++, 7, 2, 51, pieces));
	//Egypt
	units.push(unitOfId(id++, 7, 2, 44, pieces));
	units.push(unitOfId(id++, 7, 3, 44, pieces));
	units.push(unitOfId(id++, 7, 6, 44, pieces));
	//s africa
	units.push(unitOfId(id++, 7, 2, 48, pieces));

		//Japan
		units.push(unitOfId(id++, 4, 15, 28, pieces));
		units.push(unitOfId(id++, 4, 2, 28, pieces));
		units.push(unitOfId(id++, 4, 2, 28, pieces));
		units.push(unitOfId(id++, 4, 2, 28, pieces));
		units.push(unitOfId(id++, 4, 2, 28, pieces));
		units.push(unitOfId(id++, 4, 3, 28, pieces));
		units.push(unitOfId(id++, 4, 6, 28, pieces));
		units.push(unitOfId(id++, 4, 7, 28, pieces));
		units.push(unitOfId(id++, 4, 13, 28, pieces));
		//Manchuria
		units.push(unitOfId(id++, 4, 2, 29, pieces));
		units.push(unitOfId(id++, 4, 2, 29, pieces));
		units.push(unitOfId(id++, 4, 6, 29, pieces));
		//kwang
		units.push(unitOfId(id++, 4, 2, 30, pieces));
		units.push(unitOfId(id++, 4, 2, 30, pieces));
		units.push(unitOfId(id++, 4, 2, 30, pieces));
		//indochina
		units.push(unitOfId(id++, 4, 2, 31, pieces));
		units.push(unitOfId(id++, 4, 2, 31, pieces));
		units.push(unitOfId(id++, 4, 6, 31, pieces));
		//east indies
		units.push(unitOfId(id++, 4, 2, 32, pieces));
		units.push(unitOfId(id++, 4, 2, 32, pieces));
		//borneo
		units.push(unitOfId(id++, 4, 2, 34, pieces));
		//philip
		units.push(unitOfId(id++, 4, 2, 33, pieces));
		units.push(unitOfId(id++, 4, 2, 33, pieces));
		//oak
		units.push(unitOfId(id++, 4, 2, 35, pieces));
		//wake
		units.push(unitOfId(id++, 4, 2, 38, pieces));
		//car
		units.push(unitOfId(id++, 4, 2, 36, pieces));
		//new g
		units.push(unitOfId(id++, 4, 2, 37, pieces));
		//sol
		units.push(unitOfId(id++, 4, 2, 39, pieces));
	
		//USA
		units.push(unitOfId(id++, 1, 15, 1, pieces));
		units.push(unitOfId(id++, 1, 2, 1, pieces));
		units.push(unitOfId(id++, 1, 2, 1, pieces));
		units.push(unitOfId(id++, 1, 1, 1, pieces));
		units.push(unitOfId(id++, 1, 3, 1, pieces));
		units.push(unitOfId(id++, 1, 6, 1, pieces));
		units.push(unitOfId(id++, 1, 7, 1, pieces));
		units.push(unitOfId(id++, 1, 13, 1, pieces));
		// west usa
		units.push(unitOfId(id++, 1, 2, 10, pieces));
		units.push(unitOfId(id++, 1, 2, 10, pieces));
		units.push(unitOfId(id++, 1, 6, 10, pieces));
		units.push(unitOfId(id++, 1, 13, 10, pieces));
		units.push(unitOfId(id++, 1, 15, 10, pieces));
		// alaska
		units.push(unitOfId(id++, 1, 2, 7, pieces));
		// midway
		units.push(unitOfId(id++, 1, 2, 8, pieces));
		// hawaii
		units.push(unitOfId(id++, 1, 2, 9, pieces));
		units.push(unitOfId(id++, 1, 2, 9, pieces));
		units.push(unitOfId(id++, 1, 6, 9, pieces));
		// sing
		units.push(unitOfId(id++, 1, 2, 5, pieces));
		units.push(unitOfId(id++, 1, 2, 5, pieces));
		// china
		units.push(unitOfId(id++, 1, 2, 6, pieces));
		units.push(unitOfId(id++, 1, 2, 6, pieces));
		units.push(unitOfId(id++, 1, 6, 6, pieces));

	return units;
}