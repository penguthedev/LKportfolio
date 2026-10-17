/** Parts correspond to approximate regions partitioned from the supplied exterior GLB. */
export const carParts = [
  { id: 'frontWing', title: 'Front wing', description: 'Directs airflow around the front tyres and produces aerodynamic downforce.' },
  { id: 'frontNose', title: 'Nose structure', description: 'The tapered nose connects the front wing assembly to the car’s chassis.' },
  { id: 'frontLeftWheel', title: 'Front-left wheel', description: 'A racing slick tyre and rim assembly providing steering grip at the front axle.' },
  { id: 'frontRightWheel', title: 'Front-right wheel', description: 'The right-front tyre and rim; its grip helps determine steering response.' },
  { id: 'leftPod', title: 'Left sidepod', description: 'Bodywork shaped to guide airflow around the cooling and floor areas.' },
  { id: 'rightPod', title: 'Right sidepod', description: 'Streamlined outer bodywork that influences cooling airflow and aerodynamics.' },
  { id: 'cockpit', title: 'Cockpit area', description: 'The central driver area and surrounding safety structures.' },
  { id: 'rearBody', title: 'Rear bodywork', description: 'The tapering rear cover that packages components and smooths airflow.' },
  { id: 'rearWing', title: 'Rear wing', description: 'An aerodynamic assembly that generates rear downforce and stability.' },
  { id: 'rearLeftWheel', title: 'Rear-left wheel', description: 'Wide rear slick tyre and rim designed to transfer power to the road.' },
  { id: 'rearRightWheel', title: 'Rear-right wheel', description: 'Rear tyre and rim assembly that helps deliver traction under acceleration.' },
  { id: 'core', title: 'Central chassis', description: 'The central structure of the car, connecting major exterior components.' },
] as const;
export type CarPartId = (typeof carParts)[number]['id'];
