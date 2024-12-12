export function BenefitsOfHavingLiveChat() {
  return (
    <>
      <svg color="inherit" viewBox="0 0 24 24" class="lc-1usdo54"><path d="M11.75,2 C6.36522369,2 2,6.36522369 2,11.75 C2,17.1347763 6.36522369,21.5 11.75,21.5 C17.1347763,21.5 21.5,17.1347763 21.5,11.75 C21.4943161,6.36757981 17.1324202,2.00568393 11.75,2 L11.75,2 Z M16.030625,12.280625 L13.030625,15.280625 C12.7375689,15.5736811 12.2624311,15.5736811 11.969375,15.280625 C11.6763189,14.9875689 11.6763189,14.5124311 11.969375,14.219375 L13.6896875,12.5 L8,12.5 C7.58578644,12.5 7.25,12.1642136 7.25,11.75 C7.25,11.3357864 7.58578644,11 8,11 L13.6896875,11 L11.969375,9.280625 C11.6763189,8.9875689 11.6763189,8.5124311 11.969375,8.219375 C12.2624311,7.9263189 12.7375689,7.9263189 13.030625,8.219375 L16.030625,11.219375 C16.1714578,11.3600512 16.25059,11.5509431 16.25059,11.75 C16.25059,11.9490569 16.1714578,12.1399488 16.030625,12.280625 Z"></path></svg>
    </>
  )
}
export function ArrowClick() {
  return (
    <>
      <svg color="inherit" viewBox="0 0 32 32" aria-hidden="true" class="eh4tvav0 lc-y3dxrp"><path d="M9.05674797,7.10056554 L9.13703813,7.13553157 L25.4390381,15.1015316 L25.5284558,15.1506535 L25.6286153,15.2222405 C25.7452987,15.313793 25.8339182,15.4266828 25.895416,15.5505399 L25.9423517,15.6622033 L25.9751927,15.7773803 L25.9891204,15.8509608 L25.998657,15.9475578 L25.9972397,16.0748669 L25.9800642,16.201216 L25.9701282,16.2435678 C25.9550365,16.3071288 25.9331784,16.3694784 25.9050831,16.4294253 L25.8937351,16.4490792 C25.8488724,16.5422577 25.7878083,16.6290528 25.7112518,16.7055442 L25.609137,16.7931281 L25.539527,16.8424479 L25.4390381,16.8984684 L9.05674797,24.8994345 C8.4880852,25.1179893 7.84373932,24.9716543 7.42618713,24.5298922 C7.02348961,24.1049956 6.89354829,23.48994 7.08502271,22.9526995 L9.44381329,15.9994998 L7.08997091,9.06153122 C6.90991684,8.5560159 7.00409914,7.99707209 7.33051276,7.58090053 L7.4252609,7.47108641 C7.84373932,7.02834566 8.4880852,6.8820107 9.05674797,7.10056554 Z M20.6761421,16.9994644 L11.2161421,16.9994644 L9.33681329,22.5404998 L20.6761421,16.9994644 Z M9.33581329,9.45749977 L11.2161421,14.9994644 L20.6761421,14.9994644 L9.33581329,9.45749977 Z"></path></svg>
    </>
  )
}
export function Handlefile (){
  return(
    <>
    <svg color="inherit" viewBox="0 0 32 32" aria-hidden="true" class="lc-1mpchac"><path d="M15.6757055,6.00134676 L16,6 C23.7522847,6 26,8.24771525 26,16 L25.9945766,16.6420919 C25.8690003,23.877133 23.5339105,26 16,26 L15.3579081,25.9945766 C8.22772262,25.8708203 6.06260614,23.6011302 6.00134676,16.3242945 L6,16 C6,8.35690236 8.18484521,6.06440788 15.6757055,6.00134676 L15.6757055,6.00134676 Z M16.3030719,8.00097456 L15.6969281,8.00097456 C9.40924116,8.04221769 8.04153951,9.41144473 8.00094459,15.7015342 L8.00094459,16.3030719 L8.00884133,16.8782382 C8.13259991,22.6749442 9.60801003,23.9597291 15.7015342,23.9990554 L16,24 C22.6477153,24 24,22.6477153 24,16 L23.9960443,15.4012902 C23.9144445,9.4649806 22.5350194,8.08555554 16.5987098,8.00395568 L16.3030719,8.00097456 Z M16,12 C16.5522847,12 17,12.4477153 17,13 L17,15 L19,15 C19.5522847,15 20,15.4477153 20,16 C20,16.5522847 19.5522847,17 19,17 L17,17 L17,19 C17,19.5522847 16.5522847,20 16,20 C15.4477153,20 15,19.5522847 15,19 L15,17 L13,17 C12.4477153,17 12,16.5522847 12,16 C12,15.4477153 12.4477153,15 13,15 L15,15 L15,13 C15,12.4477153 15.4477153,12 16,12 Z"></path></svg>
    </>
  )
}
let isClickDisabled = false;

export const preventDoubleClick = (callback, timeout = 500) => {
    if (isClickDisabled) return;
    isClickDisabled = true;
    callback();
    setTimeout(() => {
        isClickDisabled = false;
    }, timeout);
};
