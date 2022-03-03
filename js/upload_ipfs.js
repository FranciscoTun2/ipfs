try{
  const metamask = window.web3.currentProvider;
}catch(err) {
  alert("Please install Metamask and select your account");
}

const web3 = new Web3(window.web3.currentProvider)
let alertPlaceholder = document.getElementById('liveAlertPlaceholder')
let alertPlaceholderDelete = document.getElementById('deletePlaceholder')


let accounts = await web3.eth.getAccounts()
console.log(accounts[0]);
const pinFileToIPFS = async () => {
  accounts = await web3.eth.getAccounts()
  await window.ethereum.enable();

  let file = document.getElementById('fileinput').files[0];
  if (file == undefined) {
    alertUpload('Please, select a file before Upload!', 'danger')
  }
  else {
    let spinnerUpload = document.getElementById('spinnerUpload')
    spinnerUpload.style.display = 'block'
    const url = 'https://api.pinata.cloud/pinning/pinFileToIPFS';
    let data = new FormData();
    data.append('file', file);
    console.log(file);
    const metadata = JSON.stringify({
      name: file.name,
      user : accounts[0],
      keyvalues: {
        user: accounts[0],
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

    return axios.post(url, data, {
      maxBodyLength: 'Infinity',
      headers: {
        'Content-Type': 'application/json',
        pinata_api_key: 'ba65da047212926c9ee4',
        pinata_secret_api_key: '3897644a77bf3ea3836a17fa1bed1c8897f95e5f148be0728e2f73c48aa7baec'
      }
    })
    .then(function (response) {
      console.log(response);
      let linkIPFS = document.getElementById('linkIPFS');
      // set href of linkIPFS
      linkIPFS.href = "https://gateway.pinata.cloud/ipfs/"+response.data.IpfsHash;
      let uri = document.getElementById('upload-status');
      spinnerUpload.style.display = 'none'
      uri.innerHTML = "https://gateway.pinata.cloud/ipfs/"+response.data.IpfsHash;
    })
    .catch(function (error) {
        console.log(error);
    });
  }
}


const unpinFileFromIPFS = async (IPFSHash) => {
  let hash = document.getElementById('hash').value;
  if (hash == '') {
    alertDelete('Please enter a hash', 'danger')
  }
  else {
    let spinnerDeleting = document.getElementById('spinnerDeleting')
    spinnerDeleting.style.display = 'block'

    const urlHash = 'https://api.pinata.cloud/data/pinList?status=pinned&hashContains='+hash;
    const url = 'https://api.pinata.cloud/pinning/unpin/'+hash;

    accounts = await web3.eth.getAccounts()
    let approved = await axios
      .get(urlHash, {
        headers: {
          pinata_api_key: 'ba65da047212926c9ee4',
          pinata_secret_api_key: '3897644a77bf3ea3836a17fa1bed1c8897f95e5f148be0728e2f73c48aa7baec'
        }
      })
      .then(function (response) {
          return accounts[0] === response.data.rows[0].metadata.keyvalues.user;
          //handle response here
      })
      .catch(function (error) {
          console.log(error);
          spinnerDeleting.style.display = 'none'
          alertDelete("Error During deleting", "danger")
          // stop the code from running
          //handle error here
      });
    if (approved){
      return axios
          .delete(url, {
              headers: {
                  pinata_api_key: 'ba65da047212926c9ee4',
                  pinata_secret_api_key: '3897644a77bf3ea3836a17fa1bed1c8897f95e5f148be0728e2f73c48aa7baec'
              }
          })
          .then(function (response) {
              console.log(response);
              spinnerDeleting.style.display = 'none'
              alertDelete('File deleted successfuly', 'success')
              //handle response here
          })
          .catch(function (error) {
              console.log(error);
              spinnerDeleting.style.display = 'none'
              alertDelete('Error on deleting', 'danger')

              //handle error here
          });
    }else{
      spinnerDeleting.style.display = 'none'
      alertDelete("You cannot delete this file", "danger");
    }
  }
}


const getMetaDataFromIPFS = async (IPFSHash, userAddress) => {
  // const url = 'https://api.pinata.cloud/data/pinList?status=pinned&metadata[name]=003.jpg&metadata[keyvalues]={"user":{"value":"0xa5461cbCf9c767264CC619bCF1AF3AaD083A5b22","op":"eq"}}'
  const url = 'https://api.pinata.cloud/data/pinList?status=pinned&hashContains=QmYMM59irRzh6dQuHKL1ATSQBSkvirPoXCQAqfpG422m9T'
  return axios.get(url, {
            headers: {
              pinata_api_key: 'ba65da047212926c9ee4',
              pinata_secret_api_key: '3897644a77bf3ea3836a17fa1bed1c8897f95e5f148be0728e2f73c48aa7baec'
            }
          })
          .then(function (response) {
              console.log(response.data.rows[0].metadata.keyvalues.user);
              //handle response here
          })
          .catch(function (error) {
              console.log(error);
              //handle error here
          });
}


function alertUpload(message, type) {
  let wrapper = document.createElement('div')
  wrapper.innerHTML = '<div class="alert alert-' + type + ' alert-dismissible" role="alert">' + message + '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>'

  alertPlaceholder.append(wrapper)
}

function alertDelete(message, type) {
  let wrapper = document.createElement('div')
  wrapper.innerHTML = '<div class="alert alert-' + type + ' alert-dismissible" role="alert">' + message + '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>'

  alertPlaceholderDelete.append(wrapper)
}


document.getElementById("upload").addEventListener("click", pinFileToIPFS);
document.getElementById('delete').addEventListener('click', unpinFileFromIPFS);
