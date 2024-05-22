/*
exports.generateOTP = async (req, res) => {
    try {
        let OTP = '';
        for(let i=0; i<=5; i++) {
            let ranVal = Math.round(Math.random()*9);
            OTP += ranVal;
        }
        return OTP;

    } catch (e) {
        console.log(e);
    }
}
*/


exports.generateOTP = async(req, res) => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // Generates a 6-digit OTP
}

