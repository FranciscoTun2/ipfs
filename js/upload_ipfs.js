// create a request to 'https://api.pinata.cloud/pinning/pinFileToIPFS' using post method whith headers 'pinata_api_key', 'pinata_secret_api_key' and body 'file', 'pinataMetadata' and 'pinataOptions'
// return the response
// console.log(response);




// const uploadFileToIPFS = async(file, pinataMetadata, pinataOptions) => {
//   let formData = new FormData();
//   formData.append("file", file);
//   formData.append("pinataMetadata", pinataMetadata);
//   formData.append("pinataOptions", pinataOptions);

//   let response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
//     method: 'POST',
//     headers: {
//       "pinata_api_key": "ba65da047212926c9ee4",
//       "pinata_secret_api_key": "3897644a77bf3ea3836a17fa1bed1c8897f95e5f148be0728e2f73c48aa7baec",
//       "Content-Type": "application/json"
//     },
//     body: formData
//   })
//   return response.json();
// }
// const uploadFile = async() => {
//   let file = document.getElementById('fileinput').files[0];
  
//   let reader = new FileReader();
//   reader.readAsArrayBuffer(file);

//   let pinataMetadata = {"name":"nombre"}
//   let pinataOptions = {"dads":"dasd"}
//   let response = await uploadFileToIPFS(file, pinataMetadata, pinataOptions);
//   console.log(response);
// }










const pinFileToIPFS = async () => {
  let file = document.getElementById('fileinput').files[0];
  const url = 'https://api.pinata.cloud/pinning/pinFileToIPFS';
  let data = new FormData();
  let fr = new FileReader();
  
  data.append('file', fr.readAsBinaryString(file));

  const metadata = JSON.stringify({
    name: 'nombre',
    keyvalues: {
      exapmpleKey: 'exampleValue',
    }
  })

  data.append('pinataMetadata', metadata);

  const pinataOptions = JSON.stringify({
    cidVersion:0,
    customPinPolicy:{
      regions:[
        {
          id:'FRA1',
          desiredReplicationCount:1
        },
        {
          id: 'NYC1',
          desiredReplicationCount: 2
        }
      ]
    }
  });

  data.append('pinataOptions', pinataOptions);

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      pinata_api_key: "ba65da047212926c9ee4",
      pinata_secret_api_key: "3897644a77bf3ea3836a17fa1bed1c8897f95e5f148be0728e2f73c48aa7baec"
    },
    body: data
  });
  return response.json();

}









//imports needed for this function
// const axios = import('axios');
// const fs = require('fs');
// const FormData = require('form-data');
// export const pinFileToIPFS = (pinataApiKey, pinataSecretApiKey) => {
//     const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

//     //we gather a local file for this example, but any valid readStream source will work here.
//     let data = new FormData();
//     data.append('file', fs.createReadStream('./yourfile.png'));

//     //You'll need to make sure that the metadata is in the form of a JSON object that's been convered to a string
//     //metadata is optional
//     const metadata = JSON.stringify({
//         name: 'testname',
//         keyvalues: {
//             exampleKey: 'exampleValue'
//         }
//     });
//     data.append('pinataMetadata', metadata);

//     //pinataOptions are optional
//     const pinataOptions = JSON.stringify({
//         cidVersion: 0,
//         customPinPolicy: {
//             regions: [
//                 {
//                     id: 'FRA1',
//                     desiredReplicationCount: 1
//                 },
//                 {
//                     id: 'NYC1',
//                     desiredReplicationCount: 2
//                 }
//             ]
//         }
//     });
//     data.append('pinataOptions', pinataOptions);

//     return axios
//         .post(url, data, {
//             maxBodyLength: 'Infinity', //this is needed to prevent axios from erroring out with large files
//             headers: {
//                 'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
//                 pinata_api_key: pinataApiKey,
//                 pinata_secret_api_key: pinataSecretApiKey
//             }
//         })
//         .then(function (response) {
//             //handle response here
//         })
//         .catch(function (error) {
//             //handle error here
//         });
// };





// const getUsers = () => {
//   let fr = new FileReader();
//   fr.readAsBinaryString(document.getElementById('fileinput').files[0]);
//   axios.get('https://reqres.in/api/users')
//   .then(response => {
//    const users = response.data.data;
//    console.log(`GET users`, users);
//  })
//   .catch(error => console.error(error));
//  };

//  getUsers();

// document.getElementById("upload").addEventListener("click", getUsers);
document.getElementById("upload").addEventListener("click", pinFileToIPFS);