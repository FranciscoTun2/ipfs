// create a request to 'https://api.pinata.cloud/pinning/pinFileToIPFS' using post method whith headers 'pinata_api_key', 'pinata_secret_api_key' and body 'file', 'pinataMetadata' and 'pinataOptions'
// return the response
// console.log(response);


const pinFileToIPFS = async () => {
  let file = document.getElementById('fileinput').files[0];
  const url = 'https://api.pinata.cloud/pinning/pinFileToIPFS';

  let data = new FormData();
  // let fr = new FileReader();
  // data.append('file', fr.readAsBinaryString(file));
  data.append('file', file);

  

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

  // const response = await fetch(url, {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     pinata_api_key: 'ba65da047212926c9ee4',
  //     pinata_secret_api_key: '3897644a77bf3ea3836a17fa1bed1c8897f95e5f148be0728e2f73c48aa7baec'
  //   },
  //   body: data
  // });
  // return response.json();

  return axios
      .post(url, data, {
        maxBodyLength: 'Infinity',
        headers: {
          'Content-Type': 'application/json',
          pinata_api_key: 'ba65da047212926c9ee4',
          pinata_secret_api_key: '3897644a77bf3ea3836a17fa1bed1c8897f95e5f148be0728e2f73c48aa7baec'
        }
      }).then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
          console.log(error);
      });

}

document.getElementById("upload").addEventListener("click", pinFileToIPFS);



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