/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function (knex) {
  await knex('classes').insert([
    { name: 'Guerreiro' },
    { name: 'Mago' },
    { name: 'Arqueiro' },
    { name: 'Clérigo' },

  ])

  await knex("jogadores").insert([
  
    { name: "João", class_id: 1, xp: 50, confirmed: 1 },
    { name: "Juan", class_id: 1, xp: 40, confirmed: 1 },
    { name: "Mike", class_id: 2, xp: 45, confirmed: 1 },
    { name: "Archer_Anna", class_id: 3, xp: 52, confirmed: 1 },
    { name: "Bruno", class_id: 4, xp: 53, confirmed: 1 },
    { name: "Mike_dev", class_id: 2, xp: 99, confirmed: 1 },
    { name: "Pedro", class_id: 2, xp: 99, confirmed: 1 },
    { name: "Sarah", class_id: 2, xp: 75, confirmed: 1 },
    { name: "Mario Mago", class_id: 2, xp: 75, confirmed: 1 },
    { name: "Ranger_Rick", class_id: 3, xp: 99, confirmed: 1 },
    { name: "Marcos_monster", class_id: 3, xp: 99, confirmed: 1 },
    { name: "Ronaldo", class_id: 3, xp: 80, confirmed: 1 },
    { name: "Diana", class_id: 4, xp: 95, confirmed: 1 },
    { name: "John travolta", class_id: 4, xp: 95, confirmed: 1 },
    { name: "Chris", class_id: 1, xp: 30, confirmed: 1 },
    { name: "Tank_Tom", class_id: 1, xp: 22, confirmed: 1 },
    { name: "Wizard_Wayne", class_id: 2, xp: 25, confirmed: 1 },
    { name: "Luke", class_id: 4, xp: 20, confirmed: 1 },


  ]);

};
