export type EmployeeCostInput = {
  payBasis: 'hourly' | 'annual'; pay: number; hours: number;
  annualLeave: number; personalLeave: number; holidayHours: number;
  otherLeaveHours: number; trainingHours: number; productivePercent: number;
  loading: number; superRate: number; superCap: number; capSuper: boolean;
  loadingSuper: boolean; insurance: number; payrollTax: number;
  equipment: number; trainingCost: number; admin: number; leaveProvision: number;
  other: number; recruitment: number;
};
export const employeeDefaults: EmployeeCostInput = {
  payBasis:'hourly',pay:35,hours:38,annualLeave:4,personalLeave:2,holidayHours:76,
  otherLeaveHours:0,trainingHours:38,productivePercent:85,loading:0,
  superRate:12,superCap:270830,capSuper:true,loadingSuper:true,
  insurance:1500,payrollTax:0,equipment:1500,trainingCost:1000,admin:600,
  leaveProvision:0,other:0,recruitment:2000,
};
export function employeeCost(input: EmployeeCostInput) {
  for(const value of Object.values(input)) {
    if(typeof value==='number' && (!Number.isFinite(value)||value<0||value>1e9)) throw new Error('Enter valid non-negative amounts in every field.');
  }
  if(!['hourly','annual'].includes(input.payBasis)||input.hours<=0||input.hours>38) throw new Error('Enter ordinary weekly hours above 0 and no more than 38. Overtime is not modelled.');
  if(input.annualLeave>52||input.personalLeave>52||input.productivePercent<=0||input.productivePercent>100||input.loading>100||input.superRate>100) throw new Error('Check leave weeks and percentages. Productive time must be above 0 and at most 100%.');
  const paidHours=input.hours*52;
  const wages=input.payBasis==='annual'?input.pay:input.pay*paidHours;
  const baseHourly=wages/paidHours;
  const annualLeaveHours=input.annualLeave*input.hours;
  const personalLeaveHours=input.personalLeave*input.hours;
  const unavailable=annualLeaveHours+personalLeaveHours+input.holidayHours+input.otherLeaveHours+input.trainingHours;
  if(unavailable>=paidHours) throw new Error('Leave, holidays and training must total less than annual paid hours.');
  const availableHours=paidHours-unavailable;
  const productiveHours=availableHours*input.productivePercent/100;
  const leaveLoading=annualLeaveHours*baseHourly*input.loading/100;
  const qualifyingEarnings=wages+(input.loadingSuper?leaveLoading:0);
  const superBase=input.capSuper?Math.min(qualifyingEarnings,input.superCap):qualifyingEarnings;
  const superCost=superBase*input.superRate/100;
  const otherCosts=input.insurance+input.payrollTax+input.equipment+input.trainingCost+input.admin+input.leaveProvision+input.other;
  const ongoing=wages+leaveLoading+superCost+otherCosts;
  const firstYear=ongoing+input.recruitment;
  return {paidHours,wages,baseHourly,annualLeaveHours,personalLeaveHours,availableHours,productiveHours,leaveLoading,qualifyingEarnings,superCost,otherCosts,ongoing,firstYear,weekly:ongoing/52,paidHourly:ongoing/paidHours,productiveHourly:ongoing/productiveHours,firstYearHourly:firstYear/productiveHours,onCosts:ongoing-wages};
}
