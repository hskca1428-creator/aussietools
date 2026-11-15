export type JobOption = {
  salary: number; includesSuper: boolean; superRate: number; takeHome: number;
  hours: number; days: number; homeDays: number; weeks: number;
  commuteMinutes: number; distance: number; vehicleRate: number;
  fares: number; parking: number; childcare: number; other: number;
};
export const exampleJobs: [JobOption, JobOption] = [
  {salary:90000,includesSuper:false,superRate:12,takeHome:72000,hours:38,days:5,homeDays:2,weeks:46,commuteMinutes:60,distance:30,vehicleRate:.8,fares:0,parking:10,childcare:0,other:20},
  {salary:100000,includesSuper:false,superRate:12,takeHome:78000,hours:40,days:5,homeDays:0,weeks:46,commuteMinutes:120,distance:60,vehicleRate:.8,fares:0,parking:20,childcare:0,other:20},
];
export function compareJob(job: JobOption) {
  for (const value of Object.values(job)) if (typeof value === 'number' && (!Number.isFinite(value) || value < 0 || value > 1e9)) throw new Error('Enter valid non-negative numbers.');
  if (job.weeks > 52 || job.weeks <= 0 || job.days > 7 || job.days <= 0 || job.homeDays > job.days || job.hours > 168 || job.hours <= 0 || job.superRate > 100 || job.commuteMinutes > 1440 || job.hours + (job.days-job.homeDays)*job.commuteMinutes/60 > 168) throw new Error('Check working days, hours, weeks and commute.');
  const baseSalary = job.includesSuper ? job.salary/(1+job.superRate/100) : job.salary;
  if(job.takeHome > baseSalary) throw new Error('Take-home pay must not exceed base salary.');
  const superAmount = baseSalary*job.superRate/100;
  const officeDays = job.days-job.homeDays;
  const weeklyTravel = officeDays*(job.distance*job.vehicleRate+job.fares+job.parking);
  const annualCosts = (weeklyTravel+job.childcare+job.other)*job.weeks;
  const annualHours = (job.hours+officeDays*job.commuteMinutes/60)*job.weeks;
  const annualRemaining = job.takeHome-annualCosts;
  return {baseSalary,superAmount,packageTotal:baseSalary+superAmount,officeDays,annualCosts,annualHours,annualRemaining,weeklyRemaining:annualRemaining/52,effectiveHourly:annualRemaining/annualHours,commuteHours:officeDays*job.commuteMinutes/60*job.weeks};
}
export function publicComparison(a: ReturnType<typeof compareJob>, b: ReturnType<typeof compareJob>) {
 const weekly=b.weeklyRemaining-a.weeklyRemaining, hours=(b.annualHours-a.annualHours)/52;
 return 'AussieTools — Job comparison\nJob B leaves '+(weekly>=0?'more':'less')+' money after entered work costs: $'+Math.abs(weekly).toFixed(2)+'/week.\nJob B takes '+Math.abs(hours).toFixed(1)+' '+(hours>=0?'more':'fewer')+' hours/week, averaged over 52 weeks.\nBased on user-entered take-home pay and costs. Salary figures omitted.\nhttps://www.aussietools.au/work/job-comparison';
}
