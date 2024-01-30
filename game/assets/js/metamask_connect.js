async function initApp() {
    // Check if MetaMask is installed
    if (typeof window.ethereum !== 'undefined') {
        console.log("window etherum::", window.ethereum);
        // Initialize ethers provider and signer with MetaMask
        provider = new ethers.providers.Web3Provider(window.ethereum);
        signer = provider.getSigner();
        console.log("Signer::", signer);
        // Request user permission to connect to MetaMask
        try {
            //   await window.ethereum.request({ method: 'eth_requestAccounts' });
            let accounts = await ethereum.request({ method: 'eth_requestAccounts' });

            // const userAddress = accounts[0];
            userAddress = accounts[0];
            console.log('Connected to MetaMask::', userAddress);
            sessionStorage.setItem('address', userAddress);
            window.location.reload();
            let balance = await ethereum.request({ method: 'eth_getBalance', params: [userAddress, 'latest'] });

            var formattedBalance = parseInt(balance, 16).toFixed(10);
            formattedBalance = formattedBalance / 10 ** 18;
            document.getElementById('balance').innerHTML = `<button id="eth_blnce" type="button" class="btn btn-success">
			Eth ${Number(formattedBalance).toFixed(5)}<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
				viewBox="0 0 256 417">
				<path fill="#343434" d="m127.961 0l-2.795 9.5v275.668l2.795 2.79l127.962-75.638z" />
				<path fill="#8C8C8C" d="M127.962 0L0 212.32l127.962 75.639V154.158z" />
				<path fill="#3C3C3B"
					d="m127.961 312.187l-1.575 1.92v98.199l1.575 4.601l128.038-180.32z" />
				<path fill="#8C8C8C" d="M127.962 416.905v-104.72L0 236.585z" />
				<path fill="#141414" d="m127.961 287.958l127.96-75.637l-127.96-58.162z" />
				<path fill="#393939" d="m.001 212.321l127.96 75.637V154.159z" />
			</svg>
		</button>`
            // "Balance " + Number(formattedBalance).toFixed(4);
            console.log("Current Balance :::", formattedBalance);
            checkNetwork(); // Check the network after connecting
        } catch (error) {
            console.error('Error connecting to MetaMask:', error.message);
        }

        // Listen for network changes
        window.ethereum.on('networkChanged', (newNetwork, oldNetwork) => {
            console.log('Network changed:', newNetwork);
            checkNetwork();
        });
    } else {
        alert('Please install MetaMask to use this application');
    }
}

async function checkNetwork() {
    if (!provider) {
        console.error('Provider is not initialized');
        return;
    }

    // Check if the user is connected to the Ethereum network
    try {
        const network = await provider.getNetwork();
        console.log(network);
        if (network.chainId !== 1) {
            // alert('Please connect to the Ethereum Mainnet');
        } else {
            console.log('Connected to Ethereum');
        }
    } catch (error) {
        console.error('Error checking network:', error.message);
    }
}
