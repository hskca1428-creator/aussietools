export type PackingItem = {id:string;name:string;weight:number;quantity:number;plannedQuantity:number};
export type CaravanSettings = {atm:number;baseline:number;water:number;plannedWater:number;reserve:number};
export const caravanExample:CaravanSettings={atm:2800,baseline:2200,water:120,plannedWater:60,reserve:50};
export const packingExamples:PackingItem[]=[
 {id:'accessories',name:'Accessories not in starting mass',weight:80,quantity:1,plannedQuantity:1},
 {id:'gas',name:'Filled gas cylinder (total mass)',weight:23,quantity:2,plannedQuantity:2},
 {id:'food',name:'Food and drinks',weight:35,quantity:1,plannedQuantity:1},
 {id:'camp',name:'Camping gear',weight:80,quantity:1,plannedQuantity:1},
 {id:'clothes',name:'Clothing and personal items',weight:30,quantity:1,plannedQuantity:1},
 {id:'chairs',name:'Camp chair',weight:7,quantity:2,plannedQuantity:2},
 {id:'bedding',name:'Bedding',weight:15,quantity:1,plannedQuantity:1},
];
export function caravanLoad(items:PackingItem[],settings:CaravanSettings){
 for(const value of Object.values(settings))if(!Number.isFinite(value)||value<0||value>1e6)throw new Error('Complete the mass and water fields with non-negative numbers.');
 if(settings.atm<=0||settings.atm>4500||settings.baseline<=0)throw new Error('Enter a positive starting mass and ATM limit up to 4,500 kg. This planner covers light caravans.');
 if(items.length>100)throw new Error('Use up to 100 packing items.');
 const rows=items.map(item=>{
  if(!item.name.trim())throw new Error('Give every packing item a name.');
  for(const value of [item.weight,item.quantity,item.plannedQuantity])if(!Number.isFinite(value)||value<0||value>1e6)throw new Error('Complete all packing weights and quantities with non-negative numbers.');
  if(!Number.isInteger(item.quantity)||!Number.isInteger(item.plannedQuantity)||item.quantity>1000||item.plannedQuantity>1000)throw new Error('Quantities must be whole numbers between 0 and 1,000.');
  return {...item,current:item.weight*item.quantity,planned:item.weight*item.plannedQuantity};
 });
 const gear=rows.reduce((sum,row)=>sum+row.current,0),plannedGear=rows.reduce((sum,row)=>sum+row.planned,0);
 const added=gear+settings.water,plannedAdded=plannedGear+settings.plannedWater;
 const total=settings.baseline+added,plannedTotal=settings.baseline+plannedAdded;
 const remaining=settings.atm-total,plannedRemaining=settings.atm-plannedTotal;
 return {rows,gear,plannedGear,added,plannedAdded,total,plannedTotal,remaining,plannedRemaining,afterReserve:remaining-settings.reserve,plannedAfterReserve:plannedRemaining-settings.reserve,allowance:settings.atm-settings.baseline,reduction:total-plannedTotal};
}
