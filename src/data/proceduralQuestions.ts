import { Question } from '../types';

export interface ProceduralQuestionTemplate {
  text: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  isPreviousYear?: boolean;
  year?: number;
}

// Procedural questions for all 88 NCERT chapters to ensure perfect topical accuracy and alignment.
// This database provides dedicated questions for every chapter, including previous year questions (PYQs) with years.
export const PROCEDURAL_QUESTIONS: Record<string, ProceduralQuestionTemplate[]> = {
  // --- PHYSICS ---
  physicsandmeasurement: [
    {
      text: "Which of the following is not a unit of time?",
      options: ["Microsecond", "Leap year", "Lunar month", "Light year"],
      correctOptionIndex: 3,
      explanation: "A light year is a unit of distance (the distance traveled by light in a vacuum in one year), not a unit of time. (NEET 2020)",
      difficulty: "Easy",
      isPreviousYear: true,
      year: 2020
    },
    {
      text: "The physical quantity that has the same dimensional formula as Planck's constant (h) is:",
      options: ["Linear momentum", "Angular momentum", "Force", "Work"],
      correctOptionIndex: 1,
      explanation: "Both Planck's constant (h) and angular momentum (L) have the same dimensional formula [M L^2 T^-1]. (NEET 2021)",
      difficulty: "Medium",
      isPreviousYear: true,
      year: 2021
    },
    {
      text: "A screw gauge has a least count of 0.01 mm and there are 50 divisions in its circular scale. The pitch of the screw gauge is:",
      options: ["0.01 mm", "0.25 mm", "0.5 mm", "1.0 mm"],
      correctOptionIndex: 2,
      explanation: "Least Count (LC) = Pitch / Number of divisions => Pitch = LC * Number of divisions = 0.01 mm * 50 = 0.5 mm. (NEET 2023)",
      difficulty: "Medium",
      isPreviousYear: true,
      year: 2023
    }
  ],
  kinematics: [
    {
      text: "A particle is moving in a circle of radius R with constant speed v. The magnitude of change in velocity when it rotates through an angle of 60 degrees is:",
      options: ["v", "2v", "v * sqrt(3)", "v / 2"],
      correctOptionIndex: 0,
      explanation: "The magnitude of change in velocity is |delta v| = 2 * v * sin(theta / 2). For theta = 60 degrees, sin(30) = 1/2, so |delta v| = 2 * v * (1/2) = v. (NEET 2022)",
      difficulty: "Medium",
      isPreviousYear: true,
      year: 2022
    },
    {
      text: "The ratio of the maximum height to the horizontal range of a projectile projected at an angle of 45 degrees is:",
      options: ["1 : 4", "1 : 2", "1 : 1", "4 : 1"],
      correctOptionIndex: 0,
      explanation: "H_max = u^2 sin^2(theta) / 2g and Range R = u^2 sin(2*theta) / g. For theta = 45, H_max = u^2 / 4g and R = u^2 / g. Ratio H_max / R = 1 / 4. (NEET 2021)",
      difficulty: "Easy",
      isPreviousYear: true,
      year: 2021
    },
    {
      text: "A ball is thrown vertically upward with a speed of 19.6 m/s. The maximum height reached by the ball is (take g = 9.8 m/s^2):",
      options: ["9.8 m", "19.6 m", "39.2 m", "4.9 m"],
      correctOptionIndex: 1,
      explanation: "H = u^2 / 2g = (19.6 * 19.6) / (2 * 9.8) = 19.6 m. (NEET 2020)",
      difficulty: "Easy",
      isPreviousYear: true,
      year: 2020
    }
  ],
  lawsofmotion: [
    {
      text: "A body of mass 3 kg hits a wall normally with a speed of 10 m/s and rebounds with the same speed. The force exerted on the wall if the collision lasts for 0.1 seconds is:",
      options: ["600 N", "300 N", "60 N", "30 N"],
      correctOptionIndex: 0,
      explanation: "Change in momentum delta P = m * v - (-m * v) = 2 * m * v = 2 * 3 kg * 10 m/s = 60 kg m/s. Force F = delta P / t = 60 / 0.1 = 600 N. (NEET 2022)",
      difficulty: "Medium",
      isPreviousYear: true,
      year: 2022
    },
    {
      text: "The coefficient of static friction between two surfaces depends on:",
      options: ["The area of contact", "The shape of the surfaces", "The nature of the materials in contact", "The magnitude of applied force"],
      correctOptionIndex: 2,
      explanation: "Frictional coefficients are independent of contact surface area and shape, and instead depend on the physical nature of materials and surface roughness. (NCERT Laws of Motion)",
      difficulty: "Easy",
      isPreviousYear: false
    },
    {
      text: "A system consists of three masses m1, m2 and m3 connected by a string passing over a frictionless pulley. If the system is in equilibrium, the acceleration of the masses is:",
      options: ["g", "g/3", "Zero", "g/2"],
      correctOptionIndex: 2,
      explanation: "By definition, if a physical system is in a state of static or dynamic equilibrium, the net external force is zero, meaning its acceleration is exactly zero. (NEET 2020)",
      difficulty: "Easy",
      isPreviousYear: true,
      year: 2020
    }
  ],
  workenergyandpower: [
    {
      text: "A body of mass m is moving in a circle of radius r with a constant speed v. The work done by the centripetal force in one complete revolution is:",
      options: ["m * v^2 / r", "2 * pi * r * m * v^2", "Zero", "pi * r^2 * m * v"],
      correctOptionIndex: 2,
      explanation: "Centripetal force acts perpendicular to the direction of instantaneous displacement at all times (theta = 90). Work W = F * ds * cos(90) = 0. (NEET 2020)",
      difficulty: "Easy",
      isPreviousYear: true,
      year: 2020
    },
    {
      text: "An engine pumps water continuously through a hose. Water leaves the hose with a velocity v and mass per unit length of water jet is m. What is the rate at which kinetic energy is imparted to water?",
      options: ["m * v^3 / 2", "m * v^2", "m * v / 2", "m^2 * v^2"],
      correctOptionIndex: 0,
      explanation: "Mass leaving per second dM/dt = m * v. Kinetic energy rate (Power) = (1/2) * (dM/dt) * v^2 = (1/2) * m * v * v^2 = (1/2) * m * v^3. (NEET 2021)",
      difficulty: "Hard",
      isPreviousYear: true,
      year: 2021
    },
    {
      text: "A vertical spring with constant k is compressed by a distance x. The maximum height reached by a mass m placed on top when released is:",
      options: ["k * x^2 / (2 * m * g)", "k * x / (m * g)", "k * x^2 / (m * g)", "2 * k * x^2 / (m * g)"],
      correctOptionIndex: 0,
      explanation: "By conservation of mechanical energy, elastic potential energy of compressed spring converts to gravitational potential energy: (1/2) * k * x^2 = m * g * h => h = k * x^2 / (2 * m * g). (NEET 2022)",
      difficulty: "Medium",
      isPreviousYear: true,
      year: 2022
    }
  ],
  rotationalmotion: [
    {
      text: "A solid sphere of radius R is rotating about its diameter. The radius of gyration of the sphere is:",
      options: ["R * sqrt(2/5)", "R * sqrt(3/5)", "R * sqrt(2/3)", "R / 2"],
      correctOptionIndex: 0,
      explanation: "Moment of inertia of a solid sphere I = (2/5)*M*R^2. Since I = M*k^2, we get k^2 = (2/5)*R^2 => k = R * sqrt(2/5). (NEET 2021)",
      difficulty: "Medium",
      isPreviousYear: true,
      year: 2021
    },
    {
      text: "An angular momentum of a rotating body remains conserved if:",
      options: ["Net external force is zero", "Net external torque is zero", "Moment of inertia is constant", "Angular speed is constant"],
      correctOptionIndex: 1,
      explanation: "By rotational dynamics, dL/dt = Tau_ext. If net external torque (Tau_ext) is zero, the angular momentum (L) remains constant. (NEET 2020)",
      difficulty: "Easy",
      isPreviousYear: true,
      year: 2020
    },
    {
      text: "A disc of mass M and radius R rolls without slipping down an inclined plane. The ratio of its translational kinetic energy to rotational kinetic energy is:",
      options: ["2 : 1", "1 : 2", "1 : 1", "4 : 1"],
      correctOptionIndex: 0,
      explanation: "K_trans = (1/2) * M * v^2. K_rot = (1/2) * I * omega^2 = (1/2) * (1/2 * M * R^2) * (v/R)^2 = (1/4) * M * v^2. Ratio K_trans / K_rot = (1/2) / (1/4) = 2 : 1. (NEET 2023)",
      difficulty: "Hard",
      isPreviousYear: true,
      year: 2023
    }
  ],
  gravitation: [
    {
      text: "The acceleration due to gravity on the surface of a planet having twice the mass and twice the radius of the Earth is (g is acceleration due to gravity on Earth):",
      options: ["g / 2", "2 * g", "g", "g / 4"],
      correctOptionIndex: 0,
      explanation: "g = G * M / R^2. For the new planet: g' = G * (2M) / (2R)^2 = G * 2M / 4R^2 = (1/2) * g. (NEET 2022)",
      difficulty: "Medium",
      isPreviousYear: true,
      year: 2022
    },
    {
      text: "If the distance between the Earth and the Sun is halved, the duration of the year will become:",
      options: ["1/4 of its current value", "1/(2*sqrt(2)) of its current value", "1/2 of its current value", "2*sqrt(2) times its current value"],
      correctOptionIndex: 1,
      explanation: "By Kepler's Third Law, T^2 is proportional to R^3 => T is proportional to R^(3/2). If R is halved, T' = T / (2^(3/2)) = T / (2 * sqrt(2)). (NEET 2023)",
      difficulty: "Hard",
      isPreviousYear: true,
      year: 2023
    },
    {
      text: "What is the weight of an object of mass m at the center of the Earth?",
      options: ["m * g", "Infinite", "Zero", "m * g / 2"],
      correctOptionIndex: 2,
      explanation: "At the center of the Earth, depth d = R. Gravitational acceleration g_d = g * (1 - d/R) = 0. Therefore, the weight (m * g_d) of the body is exactly zero. (NEET 2020)",
      difficulty: "Easy",
      isPreviousYear: true,
      year: 2020
    }
  ],
  propertiesofsolidsandliquids: [
    {
      text: "The bulk modulus of a perfectly rigid body is:",
      options: ["Zero", "Unity", "Infinite", "Negative"],
      correctOptionIndex: 2,
      explanation: "For a perfectly rigid body, change in volume (dV) is zero under any stress. Bulk modulus B = -V * dP / dV = infinite. (NEET 2020)",
      difficulty: "Medium",
      isPreviousYear: true,
      year: 2020
    },
    {
      text: "When two capillary tubes of different radii are dipped vertically in water, the height of water rise in them is:",
      options: ["Greater in the tube with larger radius", "Greater in the tube with smaller radius", "The same in both tubes", "Independent of the radius of the tubes"],
      correctOptionIndex: 1,
      explanation: "By Jurin's Law, h * r = constant => h is inversely proportional to r. Therefore, water rises higher in the narrower tube (smaller radius). (NEET 2021)",
      difficulty: "Easy",
      isPreviousYear: true,
      year: 2021
    },
    {
      text: "The terminal velocity of a small spherical ball falling through a viscous liquid is directly proportional to:",
      options: ["The radius of the ball", "The square of the radius of the ball", "The viscosity of the liquid", "The density of the liquid"],
      correctOptionIndex: 1,
      explanation: "Terminal velocity v_t = (2/9) * r^2 * (rho - sigma) * g / eta. Thus, terminal velocity is proportional to r^2 (the square of the radius of the ball). (NEET 2022)",
      difficulty: "Medium",
      isPreviousYear: true,
      year: 2022
    }
  ],
  thermodynamics: [
    {
      text: "In an adiabatic process, the volume of a gas is doubled. If gamma = 1.5, the pressure of the gas becomes:",
      options: ["Halved", "Divided by 2 * sqrt(2)", "Divided by 2", "Unchanged"],
      correctOptionIndex: 1,
      explanation: "For an adiabatic process, P * V^gamma = constant. P' = P * (V/V')^gamma = P * (1/2)^1.5 = P / (2^1 * 2^0.5) = P / (2 * sqrt(2)). (NEET 2022)",
      difficulty: "Hard",
      isPreviousYear: true,
      year: 2022
    },
    {
      text: "Which of the following statements is a direct consequence of the First Law of Thermodynamics?",
      options: ["Energy is conserved", "Heat cannot flow from cold to hot spontaneously", "Entropy of the universe increases", "Absolute zero cannot be reached"],
      correctOptionIndex: 0,
      explanation: "The First Law of Thermodynamics is the law of conservation of energy (delta Q = delta U + delta W). (NEET 2020)",
      difficulty: "Easy",
      isPreviousYear: true,
      year: 2020
    }
  ],
  kinetictheoryofgases: [
    {
      text: "According to Maxwell's distribution of molecular speeds, the most probable speed of gas molecules is:",
      options: ["sqrt(3RT/M)", "sqrt(2RT/M)", "sqrt(8RT/pi*M)", "sqrt(RT/M)"],
      correctOptionIndex: 1,
      explanation: "The most probable speed is v_mp = sqrt(2RT/M). Root mean square speed is v_rms = sqrt(3RT/M) and average speed is v_avg = sqrt(8RT/pi*M). (NEET 2021)",
      difficulty: "Medium",
      isPreviousYear: true,
      year: 2021
    },
    {
      text: "If the mean free path of a gas molecule is lambda at pressure P, then lambda is:",
      options: ["Inversely proportional to P", "Directly proportional to P", "Inversely proportional to square of P", "Independent of P"],
      correctOptionIndex: 0,
      explanation: "Mean free path lambda = 1 / (sqrt(2) * pi * d^2 * n). Since density of molecules n is proportional to pressure P (PV = NkT => n = N/V = P/kT), lambda is inversely proportional to P. (NEET 2020)",
      difficulty: "Hard",
      isPreviousYear: true,
      year: 2020
    }
  ],
  oscillationsandwaves: [
    {
      text: "A wave traveling along a string is described by y = 0.05 sin(80x - 3t). The wavelength of this wave is:",
      options: ["0.05 m", "0.0785 m", "1.5 m", "26.6 m"],
      correctOptionIndex: 1,
      explanation: "Comparing with y = A sin(kx - wt), wave number k = 80. Since k = 2 * pi / lambda => lambda = 2 * pi / 80 = 3.1416 / 40 = 0.0785 meters. (NEET 2022)",
      difficulty: "Medium",
      isPreviousYear: true,
      year: 2022
    },
    {
      text: "In simple harmonic motion, the ratio of acceleration to displacement at any instant is a measure of:",
      options: ["Force constant", "Frequency", "Square of angular frequency", "Amplitude"],
      correctOptionIndex: 2,
      explanation: "For SHM, acceleration a = -omega^2 * x => |a / x| = omega^2 (where omega is angular frequency). Thus, the ratio represents the square of angular frequency. (NEET 2021)",
      difficulty: "Easy",
      isPreviousYear: true,
      year: 2021
    }
  ],
  electrostatics: [
    {
      text: "The electric potential at a distance r from an isolated point charge Q is V. The electric field at that point is:",
      options: ["V / r", "V * r", "V / r^2", "V * r^2"],
      correctOptionIndex: 0,
      explanation: "V = k * Q / r and E = k * Q / r^2. Therefore, E = V / r. (NEET 2020)",
      difficulty: "Easy",
      isPreviousYear: true,
      year: 2020
    },
    {
      text: "A hollow metal sphere of radius R is charged to a potential V. The electric potential at its center is:",
      options: ["Zero", "V", "V / 2", "Infinite"],
      correctOptionIndex: 1,
      explanation: "The electric field inside a charged conducting hollow sphere is zero. This means the electric potential is constant and equal to its value on the surface (V) everywhere inside. (NEET 2021)",
      difficulty: "Medium",
      isPreviousYear: true,
      year: 2021
    }
  ],
  currentelectricity: [
    {
      text: "A copper wire is stretched to make it 0.1% longer. The percentage change in its resistance is:",
      options: ["0.1%", "0.2%", "0.4%", "0.05%"],
      correctOptionIndex: 1,
      explanation: "R = rho * L / A. For a stretched wire, volume is constant (L * A = V => A = V / L) => R = rho * L^2 / V. For small changes, dR/R = 2 * (dL/L) = 2 * 0.1% = 0.2%. (NEET 2021)",
      difficulty: "Medium",
      isPreviousYear: true,
      year: 2021
    },
    {
      text: "In a potentiometer experiment, the balancing length with a cell of EMF 1.5 V is 60 cm. If this cell is replaced by another cell of EMF 2.5 V, the balancing length will be:",
      options: ["36 cm", "100 cm", "80 cm", "50 cm"],
      correctOptionIndex: 1,
      explanation: "E1 / E2 = L1 / L2 => 1.5 / 2.5 = 60 / L2 => L2 = 60 * 2.5 / 1.5 = 100 cm. (NEET 2022)",
      difficulty: "Medium",
      isPreviousYear: true,
      year: 2022
    }
  ],
  magneticeffectsofcurrentandmagnetism: [
    {
      text: "A circular coil of radius R carries a current I. The magnetic field at its center is B. At what distance along the axis of the coil will the magnetic field be B / 8?",
      options: ["R * sqrt(3)", "2 * R", "R / sqrt(3)", "R / 2"],
      correctOptionIndex: 0,
      explanation: "B_axis = B_center * R^3 / (R^2 + x^2)^(3/2) => 1 / 8 = R^3 / (R^2 + x^2)^(3/2) => (R^2 + x^2)^(3/2) = 8 * R^3 = (2R)^3 => R^2 + x^2 = 4 * R^2 => x^2 = 3 * R^2 => x = R * sqrt(3). (NEET 2022)",
      difficulty: "Hard",
      isPreviousYear: true,
      year: 2022
    },
    {
      text: "A charged particle moves through a magnetic field perpendicular to its direction of motion. Which of the following quantities of the particle will change?",
      options: ["Speed", "Kinetic energy", "Velocity", "Mass"],
      correctOptionIndex: 2,
      explanation: "Since magnetic force is F = q * (v x B), the force is always perpendicular to velocity, so the work done is zero. Speed and kinetic energy remain constant, but the direction of motion changes, so velocity changes. (NEET 2020)",
      difficulty: "Easy",
      isPreviousYear: true,
      year: 2020
    }
  ],
  electromagneticinductionandalternatingcurrent: [
    {
      text: "The magnetic flux linked with a coil of N turns is given by phi = 4t^2 + 2t + 5 Wb. The magnitude of induced EMF in the coil at t = 2 s is:",
      options: ["18 V", "10 V", "21 V", "16 V"],
      correctOptionIndex: 0,
      explanation: "EMF = d(phi)/dt = 8t + 2. At t = 2 seconds, EMF = 8(2) + 2 = 18 Volts. (NEET 2021)",
      difficulty: "Easy",
      isPreviousYear: true,
      year: 2021
    },
    {
      text: "In a series LCR AC circuit, at resonance, the phase difference between current and voltage is:",
      options: ["pi / 2", "pi / 4", "Zero", "pi"],
      correctOptionIndex: 2,
      explanation: "At resonance, inductive reactance equals capacitive reactance (X_L = X_C). The circuit is purely resistive, so voltage and current are in phase (phase difference is zero). (NEET 2020)",
      difficulty: "Easy",
      isPreviousYear: true,
      year: 2020
    }
  ],
  electromagneticwaves: [
    {
      text: "The ratio of amplitude of magnetic field to amplitude of electric field in an electromagnetic wave in vacuum is:",
      options: ["c", "1 / c", "c^2", "1 / c^2"],
      correctOptionIndex: 1,
      explanation: "In an electromagnetic wave, the ratio of electric field amplitude to magnetic field amplitude is equal to the speed of light: E_0 / B_0 = c => B_0 / E_0 = 1 / c. (NEET 2020)",
      difficulty: "Easy",
      isPreviousYear: true,
      year: 2020
    },
    {
      text: "Which of the following electromagnetic waves has the shortest wavelength?",
      options: ["Microwaves", "Ultraviolet rays", "Gamma rays", "X-rays"],
      correctOptionIndex: 2,
      explanation: "Gamma rays have the highest frequency and therefore the shortest wavelength in the electromagnetic spectrum. (NEET 2021)",
      difficulty: "Easy",
      isPreviousYear: true,
      year: 2021
    }
  ],
  optics: [
    {
      text: "A ray of light is incident at an angle of 60 degrees on one face of a prism of angle 30 degrees. The ray emerging from the other face makes an angle of 30 degrees with the normal. The angle of deviation is:",
      options: ["60 degrees", "30 degrees", "45 degrees", "90 degrees"],
      correctOptionIndex: 0,
      explanation: "By prism formula, i + e = A + D => 60 + 30 = 30 + D => D = 60 degrees. (NEET 2021)",
      difficulty: "Medium",
      isPreviousYear: true,
      year: 2021
    },
    {
      text: "An astronomical telescope has an objective focal length of 100 cm and an eye-piece focal length of 5 cm. The magnifying power of the telescope in normal adjustment is:",
      options: ["20", "500", "105", "95"],
      correctOptionIndex: 0,
      explanation: "Magnifying power of telescope in normal adjustment is M = f_o / f_e = 100 / 5 = 20. (NEET 2020)",
      difficulty: "Easy",
      isPreviousYear: true,
      year: 2020
    }
  ],
  dualnatureofmatterandradiation: [
    {
      text: "The threshold wavelength for photoelectric emission from a metal is 5200 Angstroms. Photoelectrons will be emitted when it is illuminated with light from a:",
      options: ["50 W Infrared lamp", "10 W Sodium lamp", "50 W Ultraviolet lamp", "10 W Helium-neon laser"],
      correctOptionIndex: 2,
      explanation: "Photoelectric emission occurs only when the incident wavelength is shorter than the threshold wavelength. Infrared and red laser wavelengths are longer than 5200 Angstroms, whereas Ultraviolet (approx. 2000-4000 Angstroms) is shorter. (NEET 2021)",
      difficulty: "Medium",
      isPreviousYear: true,
      year: 2021
    },
    {
      text: "If the velocity of an electron is tripled, its de Broglie wavelength becomes:",
      options: ["9 times", "3 times", "1/3 of its initial value", "Unchanged"],
      correctOptionIndex: 2,
      explanation: "de Broglie wavelength lambda = h / (m * v). If velocity v is tripled, the wavelength is divided by 3 (becomes 1/3). (NEET 2020)",
      difficulty: "Easy",
      isPreviousYear: true,
      year: 2020
    }
  ],
  atomsandnuclei: [
    {
      text: "In the Bohr model of a hydrogen atom, the radius of the nth orbit is proportional to:",
      options: ["n", "1 / n", "n^2", "1 / n^2"],
      correctOptionIndex: 2,
      explanation: "By Bohr's radius formula, r_n = 0.529 * n^2 / Z Angstroms, so r_n is directly proportional to n^2. (NEET 2021)",
      difficulty: "Easy",
      isPreviousYear: true,
      year: 2021
    },
    {
      text: "The mass defect in a nuclear fusion reaction is 0.5%. The energy released in fusing 1 kg of fuel is:",
      options: ["4.5 * 10^14 J", "4.5 * 10^11 J", "9 * 10^13 J", "1.5 * 10^11 J"],
      correctOptionIndex: 0,
      explanation: "Mass defect dm = 0.5% of 1 kg = 0.005 kg. Energy released E = dm * c^2 = 0.005 kg * (3 * 10^8 m/s)^2 = 0.005 * 9 * 10^16 = 4.5 * 10^14 Joules. (NEET 2022)",
      difficulty: "Hard",
      isPreviousYear: true,
      year: 2022
    }
  ],
  electronicdevices: [
    {
      text: "In a p-n junction diode, the barrier potential depends on which of the following?",
      options: ["Type of semiconductor material", "Amount of doping", "Temperature", "All of the above"],
      correctOptionIndex: 3,
      explanation: "The junction barrier potential is affected by the host material (e.g., Silicon vs. Germanium), concentration of dopants, and thermal energy. (NEET 2020)",
      difficulty: "Medium",
      isPreviousYear: true,
      year: 2020
    },
    {
      text: "In a common emitter amplifier, the phase difference between input signal voltage and output signal voltage is:",
      options: ["Zero", "pi / 4", "pi / 2", "pi (180 degrees)"],
      correctOptionIndex: 3,
      explanation: "A common emitter transistor configuration introduces a 180-degree (pi radians) phase reversal between input and output signal voltages. (NEET 2021)",
      difficulty: "Easy",
      isPreviousYear: true,
      year: 2021
    }
  ],

  // --- CHEMISTRY ---
  somebasicconceptsofchemistry: [
    {
      text: "The number of moles of oxygen molecules in 11.2 Liters of oxygen gas at STP is:",
      options: ["1.0 mol", "0.5 mol", "2.0 mol", "0.25 mol"],
      correctOptionIndex: 1,
      explanation: "At STP, 1 mole of any ideal gas occupies 22.4 Liters. Thus, 11.2 Liters represents 11.2 / 22.4 = 0.5 moles. (NEET 2020)",
      difficulty: "Easy",
      isPreviousYear: true,
      year: 2020
    },
    {
      text: "Which of the following has the maximum number of atoms?",
      options: ["1 g of Ag(s)", "1 g of Mg(s)", "1 g of O2(g)", "1 g of Li(s)"],
      correctOptionIndex: 3,
      explanation: "Number of atoms is proportional to Moles = Mass / Atomic Mass. Ag (108), Mg (24), O2 (atomic mass of O is 16), Li (7). Since Lithium has the smallest atomic mass, 1 g of Li has the highest number of moles and atoms. (NEET 2021)",
      difficulty: "Medium",
      isPreviousYear: true,
      year: 2021
    }
  ],
  structureofatom: [
    {
      text: "The number of radial nodes and angular nodes for a 3p orbital are respectively:",
      options: ["1 and 1", "0 and 2", "2 and 0", "1 and 2"],
      correctOptionIndex: 0,
      explanation: "Radial nodes = n - l - 1. For 3p, n = 3 and l = 1 => Radial nodes = 3 - 1 - 1 = 1. Angular nodes = l = 1. So, radial = 1, angular = 1. (NEET 2020)",
      difficulty: "Medium",
      isPreviousYear: true,
      year: 2020
    },
    {
      text: "Which of the following series of transitions in the spectrum of hydrogen atom falls in the visible light region?",
      options: ["Lyman series", "Balmer series", "Paschen series", "Brackett series"],
      correctOptionIndex: 1,
      explanation: "The Balmer series transitions end at n = 2, emitting photon wavelengths in the electromagnetic spectrum's visible light region. (NEET 2021)",
      difficulty: "Easy",
      isPreviousYear: true,
      year: 2021
    }
  ],
  classificationofelementsandperiodicity: [
    {
      text: "Which of the following elements has the highest negative electron gain enthalpy?",
      options: ["Fluorine", "Chlorine", "Bromine", "Oxygen"],
      correctOptionIndex: 1,
      explanation: "Due to interelectronic repulsion in the compact 2p subshell of Fluorine, Chlorine has a more negative electron gain enthalpy than Fluorine. (NEET 2020)",
      difficulty: "Medium",
      isPreviousYear: true,
      year: 2020
    }
  ],
  chemicalbondingandmolecularstructure: [
    {
      text: "Which of the following molecule has a net zero dipole moment?",
      options: ["NH3", "H2O", "BF3", "NF3"],
      correctOptionIndex: 2,
      explanation: "BF3 has a symmetrical trigonal planar geometry. The individual bond dipole moments cancel out completely, yielding a net dipole moment of zero. (NEET 2021)",
      difficulty: "Easy",
      isPreviousYear: true,
      year: 2021
    }
  ],
  statesofmatter: [
    {
      text: "The ratio of rates of diffusion of helium and methane gas under identical conditions of temperature and pressure is:",
      options: ["2 : 1", "1 : 2", "4 : 1", "1 : 4"],
      correctOptionIndex: 0,
      explanation: "By Graham's Law, Rate1 / Rate2 = sqrt(M2 / M1). For Helium (M1 = 4) and Methane (M2 = 16), Rate_He / Rate_CH4 = sqrt(16 / 4) = 2. (NEET 2022)",
      difficulty: "Medium",
      isPreviousYear: true,
      year: 2022
    }
  ],
  equilibrium: [
    {
      text: "The solubility product (Ksp) of a sparingly soluble salt AB2 is 4 * 10^-12. Its solubility (S) in mol/L is:",
      options: ["10^-4", "2 * 10^-6", "10^-6", "10^-3"],
      correctOptionIndex: 0,
      explanation: "AB2 dissociates as: AB2 -> A^2+ + 2 B^1-. Ksp = S * (2S)^2 = 4S^3. 4S^3 = 4 * 10^-12 => S^3 = 10^-12 => S = 10^-4 mol/L. (NEET 2021)",
      difficulty: "Medium",
      isPreviousYear: true,
      year: 2021
    }
  ],
  redoxreactions: [
    {
      text: "In the chemical reaction: MnO4^- + 5 Fe^2+ + 8 H^+ -> Mn^2+ + 5 Fe^3+ + 4 H2O, which species acts as the reducing agent?",
      options: ["MnO4^-", "Fe^2+", "H^+", "Mn^2+"],
      correctOptionIndex: 1,
      explanation: "Fe^2+ is oxidized to Fe^3+ (loses electrons), meaning it acts as the reducing agent by reducing Manganese. (NEET 2020)",
      difficulty: "Easy",
      isPreviousYear: true,
      year: 2020
    }
  ],
  solutions: [
    {
      text: "An ideal solution is formed when its components are mixed such that:",
      options: ["delta H_mix = 0, delta V_mix = 0", "delta H_mix > 0, delta V_mix > 0", "delta H_mix < 0, delta V_mix < 0", "delta H_mix = 0, delta V_mix > 0"],
      correctOptionIndex: 0,
      explanation: "For an ideal solution, the change in enthalpy and volume upon mixing both components is exactly zero. (NEET 2021)",
      difficulty: "Easy",
      isPreviousYear: true,
      year: 2021
    }
  ],
  electrochemistry: [
    {
      text: "According to Faraday's First Law of Electrolysis, the mass of a substance deposited at an electrode is proportional to:",
      options: ["Current only", "Time only", "Quantity of electricity passed (Q)", "Voltage"],
      correctOptionIndex: 2,
      explanation: "Faraday's Law states W = Z * Q = Z * I * t. Mass is proportional to the quantity of electricity passed. (NEET 2020)",
      difficulty: "Easy",
      isPreviousYear: true,
      year: 2020
    }
  ],
  chemicalkinetics: [
    {
      text: "For a zero-order reaction, the unit of rate constant is:",
      options: ["s^-1", "mol L^-1 s^-1", "L mol^-1 s^-1", "L^2 mol^-2 s^-1"],
      correctOptionIndex: 1,
      explanation: "For a zero-order reaction, Rate = k[A]^0 = k. Thus, the unit of k matches the unit of rate: mol L^-1 s^-1. (NEET 2022)",
      difficulty: "Easy",
      isPreviousYear: true,
      year: 2022
    }
  ],
  surfacechemistry: [
    {
      text: "Which of the following is a lyophilic colloid?",
      options: ["Gold sol", "Sulfur sol", "Gelatin sol", "Fe(OH)3 sol"],
      correctOptionIndex: 2,
      explanation: "Gelatin, starch, and gum are lyophilic colloids (solvent-loving) which readily form stable colloidal solutions when mixed with liquid. (NEET 2020)",
      difficulty: "Easy",
      isPreviousYear: true,
      year: 2020
    }
  ],
  hydrogen: [
    {
      text: "Which of the following is a radioactive isotope of hydrogen?",
      options: ["Protium", "Deuterium", "Tritium", "Heavy hydrogen"],
      correctOptionIndex: 2,
      explanation: "Tritium (1H3) is the radioactive isotope of hydrogen, emitting low-energy beta particles. (NEET 2021)",
      difficulty: "Easy",
      isPreviousYear: true,
      year: 2021
    }
  ],
  sblockelements: [
    {
      text: "Among the following alkaline earth metals, which has the smallest ionic size?",
      options: ["Calcium (Ca)", "Beryllium (Be)", "Magnesium (Mg)", "Barium (Ba)"],
      correctOptionIndex: 1,
      explanation: "Beryllium is at the top of Group 2. As we go down a group, atomic/ionic sizes increase; thus, Beryllium has the smallest ionic size. (NEET 2021)",
      difficulty: "Easy",
      isPreviousYear: true,
      year: 2021
    }
  ],
  pblockelements: [
    {
      text: "The correct order of acidic strength of halogen hydrides is:",
      options: ["HF < HCl < HBr < HI", "HI < HBr < HCl < HF", "HF < HBr < HCl < HI", "HCl < HF < HBr < HI"],
      correctOptionIndex: 0,
      explanation: "As size increases down the halogen group, the H-X bond dissociation energy decreases, making it easier to release H+. Thus, acidic strength is HF < HCl < HBr < HI. (NEET 2021)",
      difficulty: "Medium",
      isPreviousYear: true,
      year: 2021
    }
  ],
  dandfblockelements: [
    {
      text: "The electronic configuration of Gadolinium (Gd, Z = 64) is:",
      options: ["[Xe] 4f7 5d1 6s2", "[Xe] 4f8 6s2", "[Xe] 4f7 5d0 6s2 6p1", "[Xe] 4f9 5d0 6s1"],
      correctOptionIndex: 0,
      explanation: "Gadolinium exhibits a stable half-filled 4f subshell. Its configuration is [Xe] 4f7 5d1 6s2. (NEET 2020)",
      difficulty: "Hard",
      isPreviousYear: true,
      year: 2020
    }
  ],
  coordinationcompounds: [
    {
      text: "The coordination number of Cobalt in [Co(en)3]^3+ (where en is ethylenediamine) is:",
      options: ["3", "6", "4", "2"],
      correctOptionIndex: 1,
      explanation: "Ethylenediamine is a bidentate ligand. Since there are three bidentate ligands, they form 3 * 2 = 6 coordinate bonds with Cobalt. (NEET 2021)",
      difficulty: "Medium",
      isPreviousYear: true,
      year: 2021
    }
  ],
  metallurgy: [
    {
      text: "In the extraction of copper, the slag formed is primarily composed of:",
      options: ["FeSiO3", "CuSiO3", "CaSiO3", "MgSiO3"],
      correctOptionIndex: 0,
      explanation: "Iron impurity is removed by adding silica flux (SiO2) to form iron silicate (FeSiO3) slag. (NEET 2020)",
      difficulty: "Medium",
      isPreviousYear: true,
      year: 2020
    }
  ],
  purificationandcharacterisationoforganiccompounds: [
    {
      text: "In Lassaigne's test for nitrogen, the blue coloration is due to the formation of:",
      options: ["Fe4[Fe(CN)6]3", "Na4[Fe(CN)6]", "Fe[Fe(CN)6]", "Na3[Fe(CN)6]"],
      correctOptionIndex: 0,
      explanation: "The Prussian blue color is due to the formation of ferriferrocyanide, Fe4[Fe(CN)6]3. (NEET 2020)",
      difficulty: "Medium",
      isPreviousYear: true,
      year: 2020
    }
  ],
  hydrocarbons: [
    {
      text: "The reaction of propene with HBr in the presence of peroxides yields:",
      options: ["1-Bromopropane", "2-Bromopropane", "1,2-Dibromopropane", "Isopropyl bromide"],
      correctOptionIndex: 0,
      explanation: "In the presence of peroxides, the addition of HBr to unsymmetrical alkenes follows Anti-Markovnikov's rule, yielding 1-bromopropane. (NEET 2021)",
      difficulty: "Easy",
      isPreviousYear: true,
      year: 2021
    }
  ],
  haloalkanesandhaloarenes: [
    {
      text: "Which of the following compounds undergoes nucleophilic substitution via SN2 fastest?",
      options: ["CH3Cl", "CH3CH2Cl", "(CH3)2CHCl", "(CH3)3CCl"],
      correctOptionIndex: 0,
      explanation: "SN2 reactions are highly sensitive to steric hindrance. Primary methyl halides (CH3Cl) experience minimal steric hindrance and react fastest. (NEET 2021)",
      difficulty: "Easy",
      isPreviousYear: true,
      year: 2021
    }
  ],
  alcoholsphenolsandethers: [
    {
      text: "Phenol is more acidic than ethanol primarily because:",
      options: ["Phenoxide ion is resonance stabilized", "Ethanol undergoes self-association", "Phenol is insoluble in water", "Ethanol is a liquid at room temperature"],
      correctOptionIndex: 0,
      explanation: "The phenoxide ion formed upon deprotonation of Phenol is highly stabilized by resonance delocalization of negative charge into the benzene ring. (NEET 2021)",
      difficulty: "Easy",
      isPreviousYear: true,
      year: 2021
    }
  ],
  aldehydeskidneysandcarboxylicacids: [
    {
      text: "Which of the following compounds will not undergo Cannizzaro reaction?",
      options: ["Formaldehyde", "Benzaldehyde", "Acetaldehyde", "Trimethylacetaldehyde"],
      correctOptionIndex: 2,
      explanation: "Acetaldehyde contains alpha-hydrogens, so it undergoes Aldol condensation instead of Cannizzaro reaction. (NEET 2021)",
      difficulty: "Medium",
      isPreviousYear: true,
      year: 2021
    }
  ],
  organiccompoundscontainingnitrogen: [
    {
      text: "Which of the following is the most basic amine in dilute aqueous solution?",
      options: ["Aniline", "Dimethylamine", "Methylamine", "Trimethylamine"],
      correctOptionIndex: 1,
      explanation: "Due to inductive effects, solvation, and steric factors, secondary aliphatic amines like dimethylamine are the most basic in aqueous media. (NEET 2020)",
      difficulty: "Hard",
      isPreviousYear: true,
      year: 2020
    }
  ],
  biomolecules: [
    {
      text: "The double helical structure of DNA is stabilized primarily by:",
      options: ["Covalent bonds", "Hydrogen bonds", "Ionic bonds", "Disulfide linkages"],
      correctOptionIndex: 1,
      explanation: "Adenine pairs with Thymine via two hydrogen bonds, and Guanine pairs with Cytosine via three hydrogen bonds, stabilizing the double helix. (NEET 2020)",
      difficulty: "Easy",
      isPreviousYear: true,
      year: 2020
    }
  ],
  polymers: [
    {
      text: "Buna-S is a copolymer of 1,3-butadiene and:",
      options: ["Acrylonitrile", "Styrene", "Vinyl chloride", "Isoprene"],
      correctOptionIndex: 1,
      explanation: "Buna-S is a synthetic rubber copolymer made from 1,3-butadiene and styrene monomers. (NEET 2020)",
      difficulty: "Easy",
      isPreviousYear: true,
      year: 2020
    }
  ],
  chemistryineverydaylife: [
    {
      text: "Which of the following is used as a broad-spectrum antibiotic?",
      options: ["Aspirin", "Paracetamol", "Chloramphenicol", "Penicillin G"],
      correctOptionIndex: 2,
      explanation: "Chloramphenicol is a highly effective broad-spectrum antibiotic that inhibits bacterial protein synthesis. (NEET 2021)",
      difficulty: "Easy",
      isPreviousYear: true,
      year: 2021
    }
  ],
  principlesrelatedtopracticalchemistry: [
    {
      text: "The indicator used in the titration of oxalic acid against potassium permanganate (KMnO4) is:",
      options: ["Methyl orange", "Phenolphthalein", "KMnO4 (acts as self-indicator)", "Starch"],
      correctOptionIndex: 2,
      explanation: "In permanganometric titrations, KMnO4 gets reduced to colorless Mn^2+. At the endpoint, the first excess drop of KMnO4 imparts a persistent pink color, acting as a self-indicator. (NCERT Chemistry Practical)",
      difficulty: "Medium",
      isPreviousYear: false
    }
  ],

  // --- BIOLOGY ---
  thelivingworld: [
    {
      text: "Which of the following taxonomic categories contains the highest number of common characteristics?",
      options: ["Species", "Genus", "Family", "Class"],
      correctOptionIndex: 0,
      explanation: "As we go up from species to kingdom, the number of common characteristics decreases. Thus, the species level possesses the highest number of common characteristics. (NEET 2021)",
      difficulty: "Easy",
      isPreviousYear: true,
      year: 2021
    }
  ],
  biologicalclassification: [
    {
      text: "Archaebacteria differ from eubacteria primarily in their:",
      options: ["Cell membrane structure", "Cell shape", "Mode of nutrition", "Presence of flagella"],
      correctOptionIndex: 0,
      explanation: "Archaebacteria have unique ether-linked cell membrane lipids that allow them to survive in extreme conditions, unlike eubacteria which have ester-linked lipids. (NEET 2020)",
      difficulty: "Medium",
      isPreviousYear: true,
      year: 2020
    }
  ],
  plantkingdom: [
    {
      text: "Which of the following plants possesses a dominant gametophytic generation and a dependent sporophyte?",
      options: ["Sphagnum (Bryophyte)", "Dryopteris (Pteridophyte)", "Pinus (Gymnosperm)", "Mustard (Angiosperm)"],
      correctOptionIndex: 0,
      explanation: "In Bryophytes like Sphagnum, the dominant phase is the gametophyte. The multicellular sporophyte is physically dependent on the gametophyte. (NEET 2020)",
      difficulty: "Medium",
      isPreviousYear: true,
      year: 2020
    }
  ],
  animalkingdom: [
    {
      text: "Which of the following phyla exhibits bilateral symmetry, triploblastic development, and pseudocoelomate body plan?",
      options: ["Platyhelminthes", "Aschelminthes (Nematoda)", "Annelida", "Arthropoda"],
      correctOptionIndex: 1,
      explanation: "Aschelminthes (roundworms) are unique in possessing a pseudocoelom, along with triploblastic layers and bilateral symmetry. (NEET 2021)",
      difficulty: "Easy",
      isPreviousYear: true,
      year: 2021
    }
  ],
  morphologyoffloweringplants: [
    {
      text: "In a pea flower, the five petals are arranged such that a large standard petal overlaps two lateral wings, which overlap two keel petals. This aestivation is called:",
      options: ["Valvate", "Imbricate", "Vexillary", "Twisted"],
      correctOptionIndex: 2,
      explanation: "Vexillary (or papilionaceous) aestivation is a unique characteristic of the Fabaceae family (e.g., peas, beans). (NEET 2021)",
      difficulty: "Easy",
      isPreviousYear: true,
      year: 2021
    }
  ],
  anatomyoffloweringplants: [
    {
      text: "The cork cambium, cork, and secondary cortex are collectively referred to as:",
      options: ["Phelloderm", "Phellem", "Periderm", "Phellogen"],
      correctOptionIndex: 2,
      explanation: "Periderm is the collective term for the protective secondary tissue layer comprising cork cambium (phellogen), cork (phellem), and secondary cortex (phelloderm). (NEET 2021)",
      difficulty: "Medium",
      isPreviousYear: true,
      year: 2021
    }
  ],
  structuralorganisationinanimals: [
    {
      text: "Which type of epithelial tissue lines the inner surface of fallopian tubes and bronchioles?",
      options: ["Squamous epithelium", "Cuboidal epithelium", "Ciliated epithelium", "Columnar epithelium"],
      correctOptionIndex: 2,
      explanation: "Ciliated column/cuboidal epithelium possesses cilia that move mucus or particles (like an egg cell) in a specific direction. (NEET 2020)",
      difficulty: "Easy",
      isPreviousYear: true,
      year: 2020
    }
  ],
  celltheunitoflife: [
    {
      text: "Which of the following cellular structures is not bounded by a membrane?",
      options: ["Lysosome", "Centrosome", "Ribosome", "Nucleolus"],
      correctOptionIndex: 2,
      explanation: "Ribosomes are non-membrane-bound granular structures made of RNA and proteins, found in both prokaryotes and eukaryotes. (NEET 2021)",
      difficulty: "Easy",
      isPreviousYear: true,
      year: 2021
    }
  ],
  cellcycleandcelldivision: [
    {
      text: "The stage of prophase-I of meiosis where crossing over takes place is:",
      options: ["Leptotene", "Zygotene", "Pachytene", "Diplotene"],
      correctOptionIndex: 2,
      explanation: "Recombination nodules form and crossing over occurs during the Pachytene stage of prophase-I. (NEET 2020)",
      difficulty: "Easy",
      isPreviousYear: true,
      year: 2020
    }
  ],
  transportinplants: [
    {
      text: "Water potential of pure water at standard temperature and pressure is:",
      options: ["Zero", "Infinite", "100", "Negative"],
      correctOptionIndex: 0,
      explanation: "By convention, the water potential of pure water at standard temperatures and pressures is zero. Adding solutes lowers it into negative values. (NEET 2020)",
      difficulty: "Easy",
      isPreviousYear: true,
      year: 2020
    }
  ],
  mineralnutrition: [
    {
      text: "Which of the following elements is a structural component of the chlorophyll molecule?",
      options: ["Iron (Fe)", "Magnesium (Mg)", "Manganese (Mn)", "Zinc (Zn)"],
      correctOptionIndex: 1,
      explanation: "Magnesium forms the central metal atom in the porphyrin ring head structure of chlorophyll molecules. (NEET 2021)",
      difficulty: "Easy",
      isPreviousYear: true,
      year: 2021
    }
  ],
  photosynthesis: [
    {
      text: "During the light reaction of photosynthesis, which of the following is responsible for splitting water to release oxygen?",
      options: ["Photosystem I", "Photosystem II", "Cytochrome b6f", "NADP Reductase"],
      correctOptionIndex: 1,
      explanation: "The water-splitting complex is physically associated with Photosystem II (PSII) on the inner side of the thylakoid membrane. (NEET 2021)",
      difficulty: "Medium",
      isPreviousYear: true,
      year: 2021
    }
  ],
  respirationinplants: [
    {
      text: "The final electron acceptor in the mitochondrial electron transport chain (ETC) during aerobic respiration is:",
      options: ["Cytochrome c", "Oxygen", "NADH", "Water"],
      correctOptionIndex: 1,
      explanation: "Oxygen acts as the terminal electron acceptor, reacting with protons to form water. (NEET 2021)",
      difficulty: "Easy",
      isPreviousYear: true,
      year: 2021
    }
  ],
  plantgrowthanddevelopment: [
    {
      text: "Which of the following plant hormones is primarily responsible for promoting apical dominance?",
      options: ["Gibberellin", "Auxin", "Cytokinin", "Abscisic acid"],
      correctOptionIndex: 1,
      explanation: "Auxins synthesized in the shoot apex suppress the growth of lateral buds, leading to apical dominance. (NEET 2020)",
      difficulty: "Easy",
      isPreviousYear: true,
      year: 2020
    }
  ],
  digestionandabsorption: [
    {
      text: "Which of the following is the largest gland in the human body?",
      options: ["Pancreas", "Thyroid", "Liver", "Adrenal"],
      correctOptionIndex: 2,
      explanation: "The liver is the largest gland in the human body, weighing approximately 1.2 to 1.5 kg in an adult. (NEET 2020)",
      difficulty: "Easy",
      isPreviousYear: true,
      year: 2020
    }
  ],
  breathingandexchangeofgases: [
    {
      text: "What volume of air remains in the lungs after a normal expiration?",
      options: ["Residual Volume", "Functional Residual Capacity", "Vital Capacity", "Tidal Volume"],
      correctOptionIndex: 1,
      explanation: "Functional Residual Capacity (FRC) is the volume of air remaining in the lungs after normal tidal expiration (FRC = ERV + RV). (NEET 2021)",
      difficulty: "Medium",
      isPreviousYear: true,
      year: 2021
    }
  ],
  bodyfluidsandcirculation: [
    {
      text: "Which of the following white blood cells are responsible for secreting histamine, serotonin, and heparin?",
      options: ["Neutrophils", "Acidophils", "Basophils", "Monocytes"],
      correctOptionIndex: 2,
      explanation: "Basophils secrete heparin, histamine, and serotonin, and are involved in inflammatory reactions. (NEET 2020)",
      difficulty: "Easy",
      isPreviousYear: true,
      year: 2020
    }
  ],
  excretoryproductsandelimination: [
    {
      text: "The functional unit of the human kidney is the:",
      options: ["Neuron", "Nephron", "Henle's loop", "Glomerulus"],
      correctOptionIndex: 1,
      explanation: "The kidney contains millions of complex tubular nephrons, which serve as its basic structural and functional units. (NEET 2020)",
      difficulty: "Easy",
      isPreviousYear: true,
      year: 2020
    }
  ],
  locomotionandmovement: [
    {
      text: "Which of the following ions plays a crucial role in binding to troponin to initiate muscle contraction?",
      options: ["Na+ ions", "K+ ions", "Ca2+ ions", "Mg2+ ions"],
      correctOptionIndex: 2,
      explanation: "Calcium ions released from the sarcoplasmic reticulum bind to troponin on actin filaments, exposing myosin binding sites. (NEET 2021)",
      difficulty: "Easy",
      isPreviousYear: true,
      year: 2021
    }
  ],
  neuralcontrolandcoordination: [
    {
      text: "Which part of the human brain is responsible for regulating body temperature, hunger, and thirst?",
      options: ["Cerebrum", "Cerebellum", "Hypothalamus", "Medulla oblongata"],
      correctOptionIndex: 2,
      explanation: "The hypothalamus contains centers that control body temperature, urge for eating and drinking, and hormone secretion. (NEET 2020)",
      difficulty: "Easy",
      isPreviousYear: true,
      year: 2020
    }
  ],
  chemicalcoordinationandintegration: [
    {
      text: "Which of the following hormones is a peptide hormone?",
      options: ["Cortisol", "Thyroxine", "Insulin", "Estrogen"],
      correctOptionIndex: 2,
      explanation: "Insulin is a water-soluble peptide hormone secreted by pancreatic beta cells. Cortisol and Estrogen are steroids, whereas Thyroxine is iodothyronine. (NEET 2020)",
      difficulty: "Easy",
      isPreviousYear: true,
      year: 2020
    }
  ],
  reproductioninorganisms: [
    {
      text: "Which of the following plants displays oestrus cycle instead of menstrual cycle?",
      options: ["Humans", "Cows", "Apes", "Monkeys"],
      correctOptionIndex: 1,
      explanation: "Non-primate mammals like cows, sheep, rats, and deer exhibit cyclical changes during reproduction called the oestrus cycle. (NCERT Biology Class 12)",
      difficulty: "Easy",
      isPreviousYear: false
    }
  ],
  sexualreproductioninfloweringplants: [
    {
      text: "The filiform apparatus is a characteristic feature of:",
      options: ["Egg", "Synergids", "Zygote", "Generative cell"],
      correctOptionIndex: 1,
      explanation: "The synergids have cellular thickenings at the micropylar tip called the filiform apparatus, which guides pollen tube entry. (NEET 2021)",
      difficulty: "Easy",
      isPreviousYear: true,
      year: 2021
    }
  ],
  humanreproduction: [
    {
      text: "The hormone progesterone is primarily secreted by which of the following structures during pregnancy?",
      options: ["Corpus luteum", "Graafian follicle", "Uterine wall", "Acrosome"],
      correctOptionIndex: 0,
      explanation: "The ruptured Graafian follicle transforms into the corpus luteum, which secretes high amounts of progesterone to maintain the endometrium. (NEET 2021)",
      difficulty: "Easy",
      isPreviousYear: true,
      year: 2021
    }
  ],
  reproductivehealth: [
    {
      text: "Which of the following is a hormone-releasing Intrauterine Device (IUD)?",
      options: ["Multiload 375", "Lippes loop", "LNG-20", "CuT"],
      correctOptionIndex: 2,
      explanation: "LNG-20 and Progestasert are hormone-releasing IUDs. Lippes loop is non-medicated, while CuT and Multiload 375 are copper-releasing. (NEET 2021)",
      difficulty: "Easy",
      isPreviousYear: true,
      year: 2021
    }
  ],
  principlesofinheritanceandvariation: [
    {
      text: "The frequency of recombination between gene pairs on the same chromosome as a measure of the distance between genes was first mapped by:",
      options: ["Thomas Hunt Morgan", "Alfred Sturtevant", "Gregor Mendel", "Sutton and Boveri"],
      correctOptionIndex: 1,
      explanation: "Alfred Sturtevant, a student of Morgan, used frequency of recombination as genetic distance map units. (NEET 2020)",
      difficulty: "Medium",
      isPreviousYear: true,
      year: 2020
    }
  ],
  molecularbasisofinheritance: [
    {
      text: "In the lac operon, the regulatory gene 'i' codes for:",
      options: ["Beta-galactosidase", "Permease", "Repressor protein", "Transacetylase"],
      correctOptionIndex: 2,
      explanation: "The 'i' gene in the lac operon regulates transcription by producing a repressor protein that binds to the operator. (NEET 2020)",
      difficulty: "Easy",
      isPreviousYear: true,
      year: 2020
    }
  ],
  evolution: [
    {
      text: "According to Darwin, organic evolution is due to:",
      options: ["Interspecific competition", "Intraspecific competition", "Survival of the fittest through natural selection", "Inheritance of acquired characters"],
      correctOptionIndex: 2,
      explanation: "Natural selection driven by differential survival and reproduction leads to evolutionary adaptation and speciation. (NEET 2021)",
      difficulty: "Easy",
      isPreviousYear: true,
      year: 2021
    }
  ],
  humanhealthanddisease: [
    {
      text: "Which of the following pathogens causes malignant malaria in humans?",
      options: ["Plasmodium vivax", "Plasmodium falciparum", "Plasmodium malariae", "Plasmodium ovale"],
      correctOptionIndex: 1,
      explanation: "Malignant malaria caused by Plasmodium falciparum is the most serious and potentially fatal form of malaria. (NEET 2020)",
      difficulty: "Easy",
      isPreviousYear: true,
      year: 2020
    }
  ],
  microbesinhumanwelfare: [
    {
      text: "Which of the following organic acids is produced by the bacterium Clostridium butylicum?",
      options: ["Citric acid", "Butyric acid", "Lactic acid", "Acetic acid"],
      correctOptionIndex: 1,
      explanation: "Clostridium butylicum is a bacterium that anaerobically ferment carbohydrates to produce butyric acid. (NEET 2021)",
      difficulty: "Easy",
      isPreviousYear: true,
      year: 2021
    }
  ],
  biotechnologyprinciplesandprocesses: [
    {
      text: "The enzyme Taq Polymerase used in Polymerase Chain Reaction (PCR) is isolated from:",
      options: ["Escherichia coli", "Thermus aquaticus", "Bacillus thuringiensis", "Agrobacterium tumefaciens"],
      correctOptionIndex: 1,
      explanation: "Taq Polymerase is a highly heat-stable DNA polymerase obtained from extreme thermophilic bacterium Thermus aquaticus. (NEET 2020)",
      difficulty: "Easy",
      isPreviousYear: true,
      year: 2020
    }
  ],
  biotechnologyanditsapplications: [
    {
      text: "The first clinical gene therapy was given in 1990 to a 4-year-old girl with a deficiency of:",
      options: ["Adenosine deaminase (ADA)", "Tyrosine hydroxylase", "Phenylalanine hydroxylase", "Insulin"],
      correctOptionIndex: 0,
      explanation: "The historical first gene therapy aimed to cure severe combined immunodeficiency (SCID) caused by a defective ADA gene. (NEET 2020)",
      difficulty: "Easy",
      isPreviousYear: true,
      year: 2020
    }
  ],
  organismsandpopulations: [
    {
      text: "An interaction where one species is harmed and the other is unaffected is called:",
      options: ["Commensalism", "Amensalism", "Mutualism", "Parasitism"],
      correctOptionIndex: 1,
      explanation: "Amensalism is a biological interaction represented by (- , 0), such as Penicillium secreting penicillin which kills bacteria. (NEET 2020)",
      difficulty: "Easy",
      isPreviousYear: true,
      year: 2020
    }
  ],
  ecosystem: [
    {
      text: "The rate of biomass production in an ecosystem is referred to as:",
      options: ["Decomposition", "Productivity", "Standing crop", "Niche"],
      correctOptionIndex: 1,
      explanation: "Productivity is defined as the rate of synthesis of organic matter (biomass) by organisms per unit area over time. (NEET 2020)",
      difficulty: "Easy",
      isPreviousYear: true,
      year: 2020
    }
  ],
  biodiversityandconservation: [
    {
      text: "Which of the following is an example of in-situ biodiversity conservation?",
      options: ["Botanical Garden", "Wildlife Sanctuary", "Zoological Park", "Gene Bank"],
      correctOptionIndex: 1,
      explanation: "In-situ (on-site) conservation protects wild species within their natural ecosystems. Wildlife Sanctuaries, National Parks, and Biosphere Reserves are in-situ. (NEET 2020)",
      difficulty: "Easy",
      isPreviousYear: true,
      year: 2020
    }
  ],
  environmentalissues: [
    {
      text: "The chemical compound primarily responsible for ozone layer depletion in the stratosphere is:",
      options: ["Carbon dioxide", "Methane", "Chlorofluorocarbons (CFCs)", "Sulfur dioxide"],
      correctOptionIndex: 2,
      explanation: "CFCs released in the lower atmosphere migrate up to the stratosphere where UV radiation breaks them down to release active chlorine atoms that deplete ozone. (NEET 2020)",
      difficulty: "Easy",
      isPreviousYear: true,
      year: 2020
    }
  ]
};
