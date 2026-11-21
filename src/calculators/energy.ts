export type EnergyItem = {
 id:string; name:string; mode:'watts'|'annual'; quantity:number;
 watts:number; plannedWatts:number; hours:number; plannedHours:number;
 days:number; plannedDays:number; kwh:number; plannedKwh:number;
};
export type EnergySettings={rate:number;supply:number;period:number};
export const energyExamples:EnergyItem[]=[
 {id:'heater',name:'Portable heater',mode:'watts',quantity:1,watts:2000,plannedWatts:2000,hours:4,plannedHours:2,days:90,plannedDays:90,kwh:0,plannedKwh:0},
 {id:'fridge',name:'Fridge (annual label)',mode:'annual',quantity:1,watts:0,plannedWatts:0,hours:0,plannedHours:0,days:365,plannedDays:365,kwh:400,plannedKwh:400},
 {id:'dryer',name:'Clothes dryer',mode:'watts',quantity:1,watts:2500,plannedWatts:2500,hours:1,plannedHours:.5,days:100,plannedDays:100,kwh:0,plannedKwh:0},
 {id:'lights',name:'Light bulbs',mode:'watts',quantity:8,watts:60,plannedWatts:10,hours:4,plannedHours:4,days:365,plannedDays:365,kwh:0,plannedKwh:0},
];
export function energyPlan(items:EnergyItem[],settings:EnergySettings){
 if(!Number.isFinite(settings.rate)||settings.rate<0||settings.rate>1000||!Number.isFinite(settings.supply)||settings.supply<0||settings.supply>10000||!Number.isFinite(settings.period)||settings.period<=0||settings.period>366)throw new Error('Enter valid bill rates and a period above 0 and at most 366 days.');
 if(items.length>50)throw new Error('Use at most 50 appliances.');
 const rows=items.map(item=>{
  if(!item.name.trim()||!['watts','annual'].includes(item.mode))throw new Error('Give each appliance a name and a valid calculation method.');
  const keys=item.mode==='watts'?['quantity','watts','plannedWatts','hours','plannedHours','days','plannedDays'] as const:['quantity','kwh','plannedKwh'] as const;
  for(const key of keys)if(!Number.isFinite(item[key])||item[key]<0||item[key]>1e7)throw new Error('Complete appliance fields with valid non-negative numbers.');
  if(item.quantity<=0||item.quantity>1000||!Number.isInteger(item.quantity))throw new Error('Quantity must be a whole number from 1 to 1,000.');
  if(item.mode==='watts'&&(item.hours>24||item.plannedHours>24||item.days>365||item.plannedDays>365||item.watts>50000||item.plannedWatts>50000))throw new Error('Use at most 24 hours/day, 365 days/year and 50,000 watts per appliance.');
  const currentKwh=(item.mode==='annual'?item.kwh:item.watts/1000*item.hours*item.days)*item.quantity;
  const plannedKwh=(item.mode==='annual'?item.plannedKwh:item.plannedWatts/1000*item.plannedHours*item.plannedDays)*item.quantity;
  const currentCost=currentKwh*settings.rate/100,plannedCost=plannedKwh*settings.rate/100;
  return {...item,currentKwh,plannedKwh,currentCost,plannedCost,saving:currentCost-plannedCost};
 });
 const currentKwh=rows.reduce((s,r)=>s+r.currentKwh,0),plannedKwh=rows.reduce((s,r)=>s+r.plannedKwh,0);
 const currentUsage=currentKwh*settings.rate/100,plannedUsage=plannedKwh*settings.rate/100;
 const supplyAnnual=settings.supply/100*365;
 return {rows,currentKwh,plannedKwh,currentUsage,plannedUsage,supplyAnnual,currentTotal:currentUsage+supplyAnnual,plannedTotal:plannedUsage+supplyAnnual,saving:currentUsage-plannedUsage,currentPeriod:(currentUsage+supplyAnnual)*settings.period/365,plannedPeriod:(plannedUsage+supplyAnnual)*settings.period/365,ranked:[...rows].sort((a,b)=>b.currentCost-a.currentCost)};
}
