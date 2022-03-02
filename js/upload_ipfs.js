const pinFileToIPFS = async () => {
  let file = document.getElementById('fileinput').files[0];
  const url = 'https://api.pinata.cloud/pinning/pinFileToIPFS';

  let data = new FormData();
  data.append('file', file);
  console.log(file);

  const metadata = JSON.stringify({
    name: file.name,
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
        let linkIPFS = document.getElementById('linkIPFS');
        // set href of linkIPFS
        linkIPFS.href = "https://gateway.pinata.cloud/ipfs/"+response.data.IpfsHash;
        let uri = document.getElementById('upload-status');
        uri.innerHTML = "https://gateway.pinata.cloud/ipfs/"+response.data.IpfsHash;
      })
      .catch(function (error) {
          console.log(error);
      });

}

const unpinFileFromIPFS = async () => {
  let hash = document.getElementById('hash').value;
  const url = 'https://api.pinata.cloud/pinning/unpin/'+hash;

  return axios
        .delete(url, {
            headers: {
                pinata_api_key: 'ba65da047212926c9ee4',
                pinata_secret_api_key: '3897644a77bf3ea3836a17fa1bed1c8897f95e5f148be0728e2f73c48aa7baec'
            }
        })
        .then(function (response) {
            console.log(response);
            //handle response here
        })
        .catch(function (error) {
            console.log(error);
            //handle error here
        });
}

document.getElementById("upload").addEventListener("click", pinFileToIPFS);
document.getElementById('delete').addEventListener('click', unpinFileFromIPFS);
