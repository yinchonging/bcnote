module.exports = {
  common: {
    zh: '中文',
    en: 'English',
    input_password: 'Enter Password',
    password: 'Password',
    verify_password: 'Verify Password',
    password_hint: 'Password Hint',
    alias: 'Alias',
    prompt: 'Prompt',
    close: 'Close',
    delete: 'Delete',
    copy: 'Copy',
    copy_tips: 'Copy Success',
    success: 'Success',
    fail: 'Failed',
    no_result: 'No Result',
    auth_fail: 'Password Validation Failed',
    ok: 'OK',
    cancel: 'Cancel',
    coming_soon: 'Coming Soon',
    exit_suggest: "One more exit",
  },

  welcome: {
    title: 'Welcome',
    tips1: 'Blockchain Encrypted Notes',
    tips2: 'Create Your First Identity',
    create_identity: 'Create Identity',
    import_identity: 'Import Identity',
    language: 'Languages',
  },

  create: {
    title: 'Create Identity',
    tips_title: 'Password Rules',
    tips_content: 'The password should be no less than 8 characters, and must contain letters, Numbers, and symbols.',
    btn: 'Create Identity'
  },

  import: {
    title: 'Import Identity',
    tips_title: 'How to import',
    tips_content: 'Copy and paste content of the %{content} file to the input field.',
    keystore: '%{content} File Content',
    import_fail: 'Import Failed %{err}',
    btn: 'Import Identity'
  },

  notebook: {
    note_count: "%{count} notes",
    notebook_count: "%{count} notebooks",
  },

  note: {
    title: 'Note',
    editor: 'Writing Note',
    count: "%{count} notes",
    notebook: 'Notebook Name',
    write: 'Start writing',
    done: 'Done',
    tips: 'When you take notes, you need to pay some GAS. The notes will be encrypted using your private key, stored in the blockchain network, and confirm throughout the network.',
    gas_fail: 'GAS calculation fails',
    get_balance_fail: 'Failed to get identity balance',
    insufficient: 'Insufficient balance',
    estimate_gas: "About ≈%{gas} %{unit}"
  },

  transaction: {
    title: 'Transaction'
  },

  block: {
    title: 'Block'
  },

  profile: {
    title: 'Me',
    my_identities: 'My Identities',
    network: 'Node Settings',
    language: 'Languages',
    helper: 'Help Center',
    agreement: 'Term Of Service',
    privacy_policy: 'Privacy Policy',
    about: 'About US',
    exit: 'Logout',
    exit_prompt: 'Make sure you have backed up all Keystore'
  },

  switch: {
    tips: 'Switch Identity'
  },

  identity: {
    title: 'Identity',
    list: 'Identities',
    eth_identities: 'ETH Identities',
    eos_identities: 'EOS Identities',
    bcnote_identities: 'BCNote Identities',
    import_eth: 'Import ETH',
    import_eos: 'Import EOS',
    receive_address: 'Receive Address',
    input_alias: 'Enter Alias',
    updata_alias: 'Change Alias',
    change_password: 'Change Password',
    backup_keystore: 'Backup Keystore',
    export_private_key: 'Export Private Key',
    del_prompt:'Make sure you have backed up this identity Keystore',
  },

  password: {
    title: 'Change Password',
    current_password: 'Current password',
    new_password: 'New password',
    verify_password: 'Verify password',
    save: 'Save changes'
  },

  eos: {
    resources: 'Resources',
    assets: 'Assets',
    total_assets: 'Total Assets',
    reclaiming: 'Reclaiming',
    staked: 'Staked',
    ram: 'RAM',
    ram_quota: 'Quota',
    cpu: 'CPU',
    net: 'NET',
    bandwidth: 'Bandwidth',
    used: 'Used',
    available: '%{str} Available',
    stake: 'Stake',
    reclaim: 'Reclaim',
    ram_sell: 'Sell',
    ram_buy: 'Buy',

    permission_view: 'Permission View',
    permission: 'Permission',
    role: 'Role %{name}',
    threshold: 'Weight Threshold %{threshold}',
    weight: 'Weightage %{weight}',
    about: 'About Resources',
    about_resources: 'The resources on EOS main platform includes RAM, Network BandWidth (NET) and CPU BandWidth (CPU), but what is the use for the mentioned resources on EOS main platform?\n' +
    '\n' +
    'RAM:\n' +
    '\n' +
    'In the EOS ecosystem, RAM is used to store the blockchain data. Executing transaction, purchasing resources, reclaiming and voting processes may consume RAM, in other words, users will not be able to carry out the above without suffficient RAM in the EOS wallet.\n' +
    '\n' +
    'RAM has to be purchased on the EOS main platform, the underlying mechanisms is different from the method to obtain CPU and NET. The market drives the price of RAM, users may check the prices of RAM/ CPU/ NET at https://www.eosrp.io/, purchasing the resouces at the most ideal time.\n' +
    '\n' +
    'Of course, please note that a 0.5% fee will be charged for the transaction to purchase RAM. The collected fee will be kept with eosio.ramfee, managed by the BPs.\n' +
    '\n' +
    'Network BandWidth (NET):\n' +
    '\n' +
    'The amount of NET required for subsequent transaction is determined using three-day average of consumption from prior transactions. Similarly, users will not be able to carry out transactions without having sufficient NET resource in the wallet.\n' +
    '\n' +
    'To illustrate the theory better, every transactions on the EOS main platfrom consumes NET, the higher the frequency of transactions executed, more NET will be consumed. However, the consumed NET will be automatically released as time passes.\n' +
    '\n' +
    'The difference with RAM is that NET is obtained through staking EOS, users can also choose to return the NET to unstake the EOS, thereby receiving the reclaimed EOS after 72 hours.\n' +
    '\n' +
    'CPU BandWidth (CPU):\n' +
    '\n' +
    'CPU resource is similar to NET resource, the amount of CPU required for subsequent transaction is determined using a three-day average of consumtion from prior transactions. Similarly, users will not be able to carry out transactions without having sufficient CPU resource in the wallet.\n' +
    '\n' +
    'Every transactions on the EOS main platfrom consumes CPU, the higher the frequency of transactions executed, more CPU will be consumed. However, the consumed CPU will be automatically released as time passes.\n' +
    '\n' +
    'The difference with RAM is that CPU is obtained through staking EOS, users can also choose to return the CPU to unstake the EOS, thereby receiving the reclaimed EOS after 72 hours.',
    why: 'Why need to buy EOS resource?',
    purchase: 'Purchase Amount',
    purchase_placeholder: 'Input EOS amount',
    sell: 'Sell Amount',
    sell_placeholder: 'Input RAM amount(bytes)',
    stake_cpu: 'Stake CPU',
    reclaim_cpu: 'Reclaim CPU',
    stake_net: 'Stake NET',
    reclaim_net: 'Reclaim NET',
    current_identity: 'Current Identity',
    current_price: 'Current Price',
    balance: 'Balance %{balance} %{unit}',
    buy_success: 'Purchase Success',
    buy_fail: 'Purchase Failed',
    sell_success: 'Sell Success',
    sell_fail: 'Sell Failed',
    stake_success: 'Stake Success',
    stake_fail: 'Stake Failed',
    unstake_success: 'Reclaim Success',
    unstake_fail: 'Reclaim Failed',
    stake_placeholder: 'Input EOS amount',
    staked_amount: 'Staked %{str}',
    reclaim_amount: 'Balance %{str}'
  },

  export: {
    title: 'Export',
    tips1_title: 'Save Offline',
    tips1_content: 'Please refrain from saving any important information on Email/Cloud Storage/Notepad/IM tools etc, it may jeopardize the security of assets.',
    tips2_title: 'Please do not transfer via the internet',
    tips2_content: 'Do not transfer through internet tools as to prevent attacks by hackers, resulting in irreversible loss of assets.',
    tips3_title: 'Utilise Password Management Tools',
    tips3_content: 'It is recommended to use professional password management tools to store and manage passwords.',
  },

  network: {
    title: 'Network Node',
    eth_node: 'ETH Node',
    eos_node: 'EOS Node',
  },


  helper: {
    title: 'Help Center',
    no0_title: "Multiple devices are not supported",
    no0_content: 'The nonce parameter cannot be synchronized and notes will fail',
    no1_title: 'How do I use Keystore safely',
    no1_content: 'The Keystore is an encrypted version of your Private key in JSON format. Keystore is like Private key except that it is protected by a password of your choosing. It is safer than the Private key because you need a password to access it. Here are some tips to keep it safe:\n' +
    ' \n' +
    '1. When you are creating your password make sure it is a strong password and it is unique to the BCNote APP. This should be a new password that has a mixture of punctuations, letters, and numbers.\n' +
    ' \n' +
    '2. Make sure to remember your Keystore. If you forget the password, there is no way for the password to be recovered and you can no longer use the Keystore.\n' +
    ' \n' +
    '3. Store your Keystore and password separately. If someone gets ahold of only your Keystore, the identity cannot be cracked quickly without knowing the password.\n' +
    ' \n' +
    '4. Do not use mailboxes or other online software to transmit Keystore or password.',
    no2_title: 'iOS jailbreak and Android ROOT device',
    no2_content: 'BCNote strongly recommends that you change your phone.\n' +
    ' \n' +
    'But if you are sure that your device is not at risk, you can also choose to ignore it. If you feel unsafe about your device, you\'d better replace the device.',
    no3_title: 'How do i import my keystore',
    no3_content_step1: 'Click "Me" ---> "My Identities" ---> Click "Import Keystore" button.',
    no3_content_step2: 'Fill in each value as prompted，Click "Import Keystore" button.',
    no4_title: 'How to backup my keystore',
    no4_content_step1: 'Click "Me" ---> "My Identities" ---> Select Identity.',
    no4_content_step2: 'Click "Backup Keystore" ---> Enter keystore password.',
    no5_title: 'How do i remove a keystore',
    no5_content_step1: 'Click "Me" ---> "My Identities" ---> Select Identity.',
    no5_content_step2: 'Click "Delete" ---> Enter keystore password.',
    no6_title: 'How do i receive',
    no6_content_step1: 'Click "Me" ---> "My Identities" ---> Select Identity.',
    no6_content_step2: 'Click "Receive Address" ---> Scanning qr code or copy address.',
    no7_title: 'Why is my note unpackaged by miners',
    no7_content_step1: 'If you found the transaction has not been packaged for a long time, you can check the status of the transfer. Click the clock icon button of the note.',
    no7_content_step2: 'Wait patiently for the deal to be packaged by the miners.\n',
    no8_title: 'Cryptocurrency purchase guide',
    no8_content: 'Watch Video',
    no8_url: 'https://v.youku.com/v_show/id_XNDAwNzUzNDE0NA==.html?spm=a2h3j.8428770.3416059.1',
  },

  agreement: {
    title: 'Term Of Service',
    content: '          BCNote Terms of Service\n' +
    '\n' +
    '          Last Updated: November 24, 2018.\n' +
    '\n' +
    '          Dear User,\n' +
    '\n' +
    '          Thank you for choosing BCNote. This BCNote Terms of Service (“Agreement”) is made between you (“User”) and Beijing Release Technology Co., Ltd.  (Company Registration Number: 91110108MA00826JX5), a company incorporated in China and having its registered address at 9 Temasek Boulevard #04-02 Suntec Tower Two China 038989 (“Company”) and is legally binding between you and Company. In this Agreement (a) “we” and “us” refer to the Company and “our” shall be construed accordingly; and (b) “you” refers to User and “your” shall be construed accordingly. Each of you and the Company shall hereinafter be referred to as a “Party”, and collectively, you and the Company shall hereinafter be referred to as the “Parties”.\n' +
    '\n' +
    '          Company hereby reminds you that you must carefully read the full content of this Agreement and other documents mentioned in this Agreement before using our mobile application “BCNote” available on various mobile platforms including but not limited to Google Play and Apple App Store (“BCNote” or “App”). In particular, you must carefully read the section of “Disclaimer and Limitation of Liability” and other sections which are displayed in bold in this Agreement. You must make sure that you fully understand the whole Agreement and evaluate the risks of using BCNote on your own.\n' +
    '\n' +
    '          I.Confirmation and Acceptance of this Agreement\n' +
    '\n' +
    '          1.You understand that this Agreement and other relevant documents apply to BCNote and the Decentralized Applications (“DApps”) which are developed and owned independently by Company on BCNote (and excluding DApps developed by third parties).\n' +
    '\n' +
    '          2.After you download BCNote and start to create, recover Identity (defined as below) or import identity（Keystore）, you are deemed as having read and accepted this Agreement, which shall cause this Agreement to become effective and legally binding on both you and Company immediately. IF YOU DO NOT AGREE TO THE TERMS IN THIS AGREEMENT, YOU SHALL CEASE USAGE OF BCNote IMMEDIATELY AND IF YOU HAVE DOWNLOADED BCNote, PROCEED TO DELETE BCNote IMMEDIATELY.\n' +
    '\n' +
    '          3.In accessing or using BCNote, you agree:\n' +
    '\n' +
    '          a) to be bound by the latest version of this Agreement without variation or modification;\n' +
    '          b) that in the jurisdiction to which you are subject, you are of legal age to use BCNote and to create binding legal and financial obligations for any liability you may incur as a result of the use of BCNote; and\n' +
    '          c) you are not an Excluded Person (as defined herein).\n' +
    '          4.Company may, at its sole discretion, modify or replace this Agreement at any time. The modified Agreement will automatically take effect once it is posted on BCNote and you will not be notified separately. If you do not agree with the modifications, you shall cease to use BCNote immediately. Use of BCNote by you after any modification to this Agreement constitutes your acceptance of this Agreement as modified.\n' +
    '\n' +
    '          II.Definition\n' +
    '\n' +
    '          1.BCNote: means the blockchain note app developed by Company based on blockchain systems and other supporting tools which are developed for the convenience of the Users when using blockchain systems.\n' +
    '          2.Excluded Person:\n' +
    '          a) a person other than a natural person who possesses legal and mental capacity to enter into this Agreement; or\n' +
    '          b) a User who is prohibited, restricted, unauthorized or ineligible in any form or manner whether in full or in part under this Agreement, laws, regulatory requirements, or rules in the jurisdiction applicable to such User, to use the Services (as defined below).\n' +
    '          3.Identity: means the blockchain identity generated from a pair of your Public Key and Private Key.\n' +
    '          4.Help Center: means the operation guide provided by the Company before you start to use BCNote (and during your future use of BCNote). This Beginner’s Guide would help you understand the basic knowledge about blockchain.\n' +
    '          5.Create or import identity(keystore): means your use of BCNote to create or import identity(keystore) after your acceptance of this Agreement.\n' +
    '          6.Identity(keystore) Password: means the password determined by you when you create the identity. The identity(keystore) Password will be used to encrypt and protect your Private Key. BCNote, as a decentralized application, will not store your identity(keystore) Password on our servers, nor will your identity Password be stored in your own mobile devices. If you lose or forget your identity(keystore) Password, you will have to reset the identity(keystore) Password with your Private Key or Mnemonic Words.\n' +
    '          7.Alert: means the messages displayed on BCNote’s operation interface which provides suggestions for Users on subsequent operations.\n' +
    '          8.Specific Users: means Users who should cooperate with Company and disclose Personal Information in order to comply with the laws, regulations and policies of China and other countries.\n' +
    '          9.Developer Users: means Users who use services provided to Developers, such as BCNote Open Source Code and Developer mode etc., in accordance with notices of the Company and relevant Open Source License.\n' +
    '          10.Private Key: consists of 256 random bits. Private Key is the core for the User to hold and use the Tokens.\n' +
    '          11.Public Key: is derived from the Private Key based on cryptography and is used to generate identity addresses. A identity address is a public address for receipt of Tokens.\n' +
    '          12.Mnemonic Words: consists of 12 (or 15/18/21/24) words which are randomly generated, and it is based on BIP39, the industry standard of blockchain. It is a human readable format of words to back up your Private Key for recovery.\n' +
    '          13.Keystore: means Private Key or Mnemonic Words in the format of a file which is encrypted and protected by the User’s identity Password. Keystore is stored only in your mobile device and will not be synchronized to the Company’ servers.\n' +
    '          14.Personal Information: means information recorded in electronic or any other form which may identify a natural person when used alone or in combination with other information, including but not limited to name, date of birth, identification card number, personal biological identification information, address, telephone number, bank card number, e-mail address, identity address, mobile device information, operation record, transaction record, but excluding identity Password, Private Key, Mnemonic Words and Keystore.\n' +
    '          15.Smart Contract: means the type of Smart Contract operating on Ethereum blockchain and spreading, verifying and executing contracts via information methods, including but not limited to Smart Contract Kyber and/or Smart Contract 0x as hereinafter mentioned. Smart Contracts integrated on BCNote do not provide cross-blockchain services.\n' +
    '          16.ETH means Ether, the cryptographic token associated with the Ethereum blockchain, which for the avoidance of doubt does not include “Ethereum Classic”.\n' +
    '          17.BCNote Open Source Code (“BCNote OSC”): means the partial software code of BCNote that Company has publicized and made open-source. Users may use (include further development) such open source software code in accordance with relevant Open Source License and notices of the Company.\n' +
    '          18.Open Source License: means the third-party-developed open source license that shall be abided by Developer Users when using BCNote OSC.\n' +
    '\n' +
    '          III.BCNote Services (collectively, the “Services”)\n' +
    '\n' +
    '          Users who use BCNote acknowledges and accepts that:\n' +
    '\n' +
    '          1.In order to keep the decentralization feature of blockchain and to protect the security of your digital Tokens, Company offers decentralized service which is largely different from the centralized service of Internet companies. Users acknowledge and accept that the Company SHALL NOT have any responsibility to :\n' +
    '          a) store Users’ Identity Password (the password Users set when creating or importing identities), Private Key, Mnemonic Words or Keystore;\n' +
    '          b) recover Users’ Identity Password, Private Key, Mnemonic Words or Keystore;\n' +
    '          c) freeze the identity;\n' +
    '          d) report the loss of identity;\n' +
    '          e) recover the identity; or\n' +
    '          f) rollback transactions.\n' +
    '          2.You shall bear sole responsibility to take care of your mobile devices, back up the BCNote App, and back up the identity Password, Mnemonic Words, Private Key and Keystore. In the event that: your mobile device is lost, your BCNote App or your identity is deleted and not backed up, your identity is stolen or you forget your identity Password, Private Key, Mnemonic Words or Keystore, the Company will not be able to recover the identity or recover identity Password, Private Key, Mnemonic Words or Keystore. The Company may not be able to cancel transactions for the mishandling of Users (such as typing in wrong addresses for transactions, wrong amounts to be exchanged) and the Company shall not be responsible in any way in respect of the same.\n' +
    '          3.The DApps integrated into BCNote include those developed independently by Company and those developed by third parties. BCNote only provides blockchain search and browser functions for those third-party-developed DApps, and thus BCNote does not offer any guarantee for functions or service qualities of those third-party-developed DApps. Users shall, at their sole discretion, decide whether there would be any risks to accept the services provided by or to conduct transactions on the third-party-developed DApps.\n' +
    '\n' +
    '          IV.Your Rights and Obligations\n' +
    '\n' +
    '          1.Create or Import identity\n' +
    '\n' +
    '          a) Create or import identity: you are entitled to use BCNote on your mobile device to create and/or import identity, set identity Password and use your identity on BCNote to transfer and receive Tokens on blockchain.\n' +
    '          b) Identification verification: Specific Users will be asked to complete identification verification before using BCNote to comply with related laws and regulations, according to the notification of BCNote. Specific Users may be asked to provide Personal Information including but not limited to name, identification card number, cell phone number, bank card information, etc., without which the Specific Users will not be able to use certain services and the Specific Users alone shall be responsible for the loss caused by their delay in completing the verification.\n' +
    '          c) Company may develop different versions of BCNote for different terminal devices. You shall download and install applicable version. If you download and install BCNote or other application with the same name as “BCNote” from any unauthorized third party, Company cannot guarantee the normal operation or security of such application. Any loss caused by using such application shall be borne solely by you.\n' +
    '          d) A previous version of BCNote may stop to operate after a new version is released. Company cannot guarantee the security, continuous operation or customer services for the previous version. Users shall download and use the latest version.\n' +
    '\n' +
    '          2.Use of BCNote\n' +
    '\n' +
    '          a) You shall bear sole responsibility to take care of your mobile devices, identity Password, Private Key, Mnemonic Words and Keystore. Company does not store or hold the above information for Users. You shall be solely responsible for any risks, liabilities, losses and expenses which result from frauds, you losing your mobile device, disclosing (whether actively or passively) or forgetting identity Password, Private Key, Mnemonic Words or Keystore, or your identity being attacked.\n' +
    '          b) BCNote Alerts. You understand and agree to comply with the Alert(s) published by the Company on BCNote. You shall be responsible for any risks, liabilities, losses and expenses which result from your failure to comply with any Alert(s).\n' +
    '          c) You understand that BCNote undertakes no responsibility to conduct due diligence on the services or transactions provided by third-party-developed DApps or Smart Contracts. You shall assess carefully and assume all risks in connection with the use of BCNote.\n' +
    '          d) Provision of information and documents. To the extent that the Company determines, in its sole discretion, that it is necessary to obtain certain information about User in order to comply with any applicable law or regulation in connection with the use or operation of BCNote, User shall provide Company with such information promptly upon such request, and acknowledges and accepts that Company may restrict, suspend or terminate your use of BCNote until such requested information has been provided to the satisfaction of Company. User undertakes to notify Company of any change in the documents and information provided by User to Company pursuant to this Agreement and in the absence of any notification in writing notifying of any change, Company is entitled to assume that the documents and information provided by User remain true, correct, not misleading and unchanged.\n' +
    '          e) Complete identification verification. If Company reasonably deems your operation or transactions to be abnormal, or considers your identification to be doubtful, or Company considers it necessary to verify your identification documents or other necessary documents, you shall cooperate with Company and provide your valid identification documents or other necessary documents and complete the identification verification in time.\n' +
    '          f) Notifications. BCNote may send notifications to you by web announcements, e-mails, text messages, phone calls, Notification Centre information, popup tips or client-end notices (e.g., information about your transfer or suggestions on certain operations) which you shall be aware of timely.\n' +
    '          g) Service fees and taxes.\n' +
    '          i.Third-party-developed Smart Contracts may charge handling fees and/or service fees from you, which shall be subject to the fees collected by those Smart Contracts, and the relevant information displayed on BCNote is merely for your reference;\n' +
    '          ii.the Company does not charge you any service fees or handling fees for the time being. The Company may reach an agreement with you or announce rules regarding service fees in the future;\n' +
    '          iii.You need to pay “gas” or network fees when you transfer Tokens, the amount of which would be on your sole discretion and would be collected by the relevant blockchain network;\n' +
    '          iv.You understand that your transfer of Tokens may fail under certain circumstances, including but not limited to insufficient “gas” or network fees paid by you for the transfer of Tokens during the time of your transfer, or the relevant blockchain network being unstable, and in such event, you may still be charged gas by the relevant blockchain network, notwithstanding the failed transfer attempted;\n' +
    '          v.You shall bear all the applicable taxes and other expenses occurred due to your transactions on BCNote.\n' +
    '\n' +
    '          3.Developer Users’ Development Based on BCNote OSC\n' +
    '\n' +
    '          a) Developer Users are entitled to use officially publicized BCNote OSC, conduct further development of programs, and download and use any patches or vulnerabilities solutions regarding BCNote OSC.\n' +
    '          b) When using BCNote OSC, Developer Users acknowledge and agree that:\n' +
    '          i. if Developer Users find any vulnerabilities, defects or software improvement solutions when using BCNote OSC, Developer Users shall promptly contact and inform the Company and discontinue any harmful use behavior (if applicable);\n' +
    '          ii. BCNote OSC may contain third-party-developed Open Source License and source code and the Company does not provide any guarantee for functions, non-existence of virus or vulnerabilities etc of such third-party-developed Open Source License and source code. Developer Users shall, at their sole discretion, decide the consequences of using BCNote OSC. Developer Users shall carefully read and then agree with relevant Open Source License (including without limitation, Apache’s Open Source License: http://www.apache.org/licenses/LICENSE-2.0.html) and notices of the Company updated from time to time.\n' +
    '\n' +
    '          V.Risks\n' +
    '\n' +
    '          1.When you use third-party-developed DApps and Smart Contracts integrated in BCNote, Company strongly suggest you read the terms of use, privacy policy, and other relevant documents and information of such third-party-developed DApps and Smart Contracts carefully, get familiar with the counterparty and the product information and evaluate the risks before you make transactions on such DApps or Smart Contracts. You understand that such transactions and corresponding contractual relationship are between you and your counterparty, instead of the Company. The Company shall not be held liable for any risks, responsibilities, losses or expenses occurred due to such transactions.\n' +
    '          2.You understand that after you create or import identity on BCNote, your Keystore, Private Key and Mnemonic Words are only stored on your mobile device and will not be stored in BCNote or on the servers of Company. You may change another mobile device to use BCNote after you follow the instructions on BCNote to back up your identity. If you lose your mobile device before you could write down or backup your identity Password, Private Key, Mnemonic Words or Keystore, you may lose your Tokens and Company will not be able to recover them. If your identity Password, Private Key, Mnemonic Words or Keystore is disclosed or the device which stores or holds your identity Password, Private Key, Mnemonic Words or Keystore is hacked or attacked, you may lose your Tokens and Company will not be able to recover them. Any and all losses arising in connection with the foregoing shall be borne solely by you.\n' +
    '          3.We suggest you backup your identity Password, Private Key, Mnemonic Words and Keystore when you create or import identity by writing them down on papers or backup them in password management apps. Please do not use electronic methods such as screenshots, e-mails, note-taking apps in cell phones, text messages, WeChat or QQ to backup any of the foregoing information.\n' +
    '          4.In order to avoid potential security risks, we suggest you use BCNote in a secured network environment. Please do not use a jailbreak or rooted mobile device.\n' +
    '          5.Please be alert to frauds when you use BCNote. If you find any suspicious activity, we encourage you to inform us immediately.\n' +
    '\n' +
    '          VI.Change, Suspension, Termination of Company Service\n' +
    '\n' +
    '          1.You acknowledge and accept that Company may, at its sole discretion, provide only a part of the Services for the time being, suspend certain Services or provide new Services in the future. When we change our Services, your continuous use of BCNote is deemed as your acceptance of this Agreement and revisions of this Agreement.\n' +
    '          2.In order to avoid (to the extent possible) any mishandling of BCNote or any risk to the security of your Tokens, you shall not use BCNote if you do not possess the basic knowledge of blockchain. For Users who do not possess basic knowledge of blockchain, Company may refuse to provide all or part of the Services on BCNote to such Users.\n' +
    '          3.You understand that Company may suspend the Services under the following circumstances (or may completely terminate the Services in connection with any of the following circumstances):\n' +
    '          a) maintenance, upgrading, failure of equipment and blockchain system and the interruption of communications etc., which lead to the suspension of the operation of BCNote;\n' +
    '          b) force majeure events including but not limited to typhoon, earthquake, tsunami, flood, power outage, war, or terrorist attacks, or computer viruses, trojan horse, hacker attacks, system instability or government behaviors and other reasons, which result in the Company’s inability to provide Services or if in Company’s reasonable opinion, continuous provision of Services would result in significant risks;\n' +
    '          c) material adverse change of applicable laws or policies; or\n' +
    '          d) any other event(s) which Company cannot control or reasonably predict.\n' +
    '          4.Company reserves the right to unilaterally suspend or terminate all or part of the Services or any function of BCNote under the following circumstances:\n' +
    '          a) death of Users;\n' +
    '          b) if you steal others’ identities information or mobile devices;\n' +
    '          c) if you provide false Personal Information on BCNote;\n' +
    '          d) if you refuse to allow mandatory update of BCNote;\n' +
    '          e) if you use BCNote OSC in breach of third-party Open Source License or notices of the Company;\n' +
    '          f) if you use BCNote to commit illegal or criminal activities;\n' +
    '          g) if you hinder the normal use of BCNote by other Users;\n' +
    '          h) if you pretend to be staff or management personnel of Company;\n' +
    '          i) if you threaten the normal operation of Company computer system by attack, invasion, alternation or any other means;\n' +
    '          j) if you use BCNote to send spam; or\n' +
    '          k) if you spread rumours which endanger the goodwill of Company and BCNote;\n' +
    '          l) if you conduct any illegal activities, breach this Agreement etc. or other circumstances under which Company reasonably considers necessary to suspend Services.\n' +
    '          5.You are entitled to export your identities within a reasonable amount of time if Company changes, suspends or terminates its Services.\n' +
    '\n' +
    '          VII.Your Representations and Warranties\n' +
    '\n' +
    '          1.You shall comply with all applicable laws and regulations of the country or area you reside in. You shall not use BCNote for any unlawful purposes or by any unlawful means.\n' +
    '          2.You shall not use BCNote to commit any illegal or unlawful activities, including but not limited to:\n' +
    '          a) activities endangering national security of the country or area you reside in, disclosing state secrets, overturning the government or undermining national unity;\n' +
    '          b) any illegal conducts, such as money laundering, illegal fund raising etc.;\n' +
    '          c) accessing Company services, collecting or processing the content provided by Company, intervening or attempting to intervene any Users, by the employment of any automated programs, software, network engines, web crawlers, web analytics tools, data mining tools or similar tools etc.;\n' +
    '          d) providing gambling information or inducing others to engage in gambling;\n' +
    '          e) invading into others’ BCNote identities to steal Tokens;\n' +
    '          f) engaging in any inaccurate or false transactions with the counterparty;\n' +
    '          g) committing any activities which harms or attempts to harm BCNote service system and data;\n' +
    '          h) other activities which Company has reason to believe are inappropriate.\n' +
    '          3.You understand and accept that you shall be responsible for any violation of law (including but not limited to the customs and/or tax regulations) or for breach of this Agreement by you and shall indemnify Company against the losses, the third-party claims or administrative penalties against Company incurred by such violation or breach, including reasonable attorney’s fees.\n' +
    '          4.You confirm that you will pay the service fees charged by Company in time (if applicable). Company reserves the right to suspend the services when the User fails to pay service fees (if applicable).\n' +
    '\n' +
    '          VIII.Privacy Policy\n' +
    '\n' +
    '          Any personal data or information which you provide to us is also subject to our privacy policy (“BCNote Privacy Policy”), which is incorporated by reference into this Agreement.\n' +
    '\n' +
    '          IX.Disclaimer and Limitation of Liability\n' +
    '\n' +
    '          1.Company only undertakes obligations expressly set forth in this Agreement.\n' +
    '\n' +
    '          2.YOU ACKNOWLEDGE AND ACCEPT THAT, TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, BCNote IS PROVIDED ON AN “AS IS”, “AS AVAILABLE” AND “WITH ALL FAULTS” BASIS. Company shall not be held liable for malfunction of BCNote which results from any of the following reasons:\n' +
    '          a) system maintenance or upgrading of BCNote;\n' +
    '          b) force majeure, such as typhoon, earthquake, flood, lightning or terrorist attack etc.;\n' +
    '          c) malfunction of your mobile device hardware and software, and failure of telecommunication lines and power supply lines;\n' +
    '          d) your improper, unauthorized or unrecognized use of the Services;\n' +
    '          e) computer viruses, trojan horse, malicious program attacks, network congestion, system instability, system or equipment failure, telecommunication failure, power failure, banking issues, government acts etc.;\n' +
    '          f) any other reasons not imputed to Company.\n' +
    '\n' +
    '          3.Company shall not be held liable due to any of the following circumstances:\n' +
    '\n' +
    '          a) you losing your mobile devices, deleting BCNote applications and identities without back-up, forgetting identity Passwords, Private Keys, Mnemonic Words, Keystores without back-up, which result in the loss of such User’s Tokens;\n' +
    '          b) you disclosing your identity Passwords, Private Keys, Mnemonic Words, Keystores, or lending or transfering your BCNote identities to others, or authorizing others to use your mobile devices or BCNote identities, or downloading BCNote applications through unofficial channels, or using BCNote applications by other insecure means, which result in the loss of your Tokens and Notes;\n' +
    '          c) you mishandling BCNote (including but not limited to wrong address, failure of the node servers selected by you) , which result in the loss of Tokens and Notes;\n' +
    '          d) you being unfamiliar with the lack of knowledge in relation to blockchain technology and your mishandling of BCNote resulting in loss of your Tokens;\n' +
    '          e) BCNote being unable to copy accurate transaction records due to system delay or blockchain instability etc.;\n' +
    '          4.Each User shall undertake the risks and consequences arising or in connection with the following:\n' +
    '          a) such User’s transactions on the third-party-developed DApps or Smart Contracts;\n' +
    '          b) the use of developer mode by Users; and\n' +
    '\n' +
    '          5.You acknowledge that BCNote may provide services to you and your counterparty simultaneously or may have affiliation or other interest relationship with foregoing parties, and you agree to waive any actual or potential conflicts of interests and will not claim against Company on such base or burden Company with more responsibilities or duty of care.\n' +
    '\n' +
    '          6.Company does not warrant that:\n' +
    '\n' +
    '          a) services provided by Company would satisfy all your needs;\n' +
    '          b) all techniques, products, services, information or other materials from Company would meet your expectations;\n' +
    '          c) all the transaction information in digital Tokens markets captured from the third party exchanges are prompt, accurate, complete, and reliable;\n' +
    '          d) your counterparties on BCNote will perform their obligations in the transaction agreements with you timely.\n' +
    '\n' +
    '          7.In any case, the total liability for Company under this Agreement shall not exceed the greater of:\n' +
    '\n' +
    '          a) the market value of 0.1 ETH; or\n' +
    '          b) 100 China RMB.\n' +
    '          8.You are aware that BCNote is only a tool for Users to manage their Tokens and to display transaction information. Company does not provide legal, tax or investment advice. You shall seek advice from professional legal, tax, and investment advisors. In addition, Company shall not be liable for any investment loss, data loss etc. during your use of our service.\n' +
    '\n' +
    '          9.You understand that we may change our entry standards, limit the range and ways to provide services for specific Users etc. at any time in accordance with applicable laws and regulations.\n' +
    '\n' +
    '          X.Miscellaneous\n' +
    '\n' +
    '          1.No Assignment\n' +
    '          Subject to this Agreement, only you and no other person shall have the right to any claim against us in connection with use of the Services. You shall not assign, trade or transfer, or attempt to assign, trade or transfer, your right to any such claim. Any such assignment or transfer shall be void and shall not impose any obligation or liability on or against us to the assignee or transferee.\n' +
    '\n' +
    '          2.Intellectual Property Rights\n' +
    '          BCNote is an application developed and owned by Company. The intellectual property rights of any contents displayed in BCNote (including this Agreement, announcements, articles, videos, audios, images, archives, information, materials, trademarks or logos) are owned by Company or the third-party licensors. Users can only use the BCNote applications and its contents for the purpose of holding and managing their Tokens and Notes. In particular, without prior written consent (or permit from relevant Open Source License) from the Company or the third-party licensors, no one shall use, modify, decompile, reproduce, publicly disseminate, alter, distribute, issue or publicly publish the abovementioned applications and contents (including BCNote OSC). This Agreement shall not entitle you to any intellectual property rights, including the rights in relation to the use, for any purpose, of any information, image, user interface, logos, trademarks, trade names, internet domain names or copyright in connection with us or the Services.\n' +
    '\n' +
    '          3.No Waiver\n' +
    '          Any failure by us to enforce this Agreement or to assert any right(s), claim(s) or causes of action against you under this Agreement shall not be construed as a waiver of our right to assert any right(s), claim(s) or causes of action against you.\n' +
    '\n' +
    '          4.Entire Agreement\n' +
    '          This Agreement includes this BCNote Terms of Service, BCNote Privacy Policy, and other rules (including contents in the “Support” column) posted by Company from time to time.\n' +
    '\n' +
    '          Save for BCNote Terms of Service, BCNote Privacy Policy which are incorporated in this Agreement, this Agreement contains the entire agreement and the understanding between us and supersedes all prior agreements, understandings or arrangements (both oral and written) in relation to the use of BCNote and the services in connection thereto.\n' +
    '\n' +
    '          5.Taxes\n' +
    '\n' +
    '          5.1 The use of Services shall be exclusive of all taxes that are applicable to, arising from, or in connection to your use of the Services in any jurisdiction (“Payable Tax”).\n' +
    '\n' +
    '          5.2 You shall be responsible for determining any Payable Tax and declaring, withholding, collecting, reporting and remitting the correct amount of Payable Tax to the appropriate tax authorities. You shall be solely liable for all penalties, claims, fines, punishments, or other liabilities arising from the non-fulfilment or non-performance to any extent of any of your obligations in relation to the Payable Tax.\n' +
    '\n' +
    '          5.3 We shall not be responsible for determining any Payable Tax and declaring, withholding, collecting, reporting and remitting the correct amount of Payable Tax to the appropriate tax authorities.\n' +
    '\n' +
    '          6.Governing Law and Dispute Resolution\n' +
    '\n' +
    '          This Agreement shall be governed by and construed in accordance with the laws of the Republic of China.\n' +
    '\n' +
    '          In the event of any dispute arising out of or in connection with this Agreement, including any question regarding its existence, validity or termination, the Parties shall first seek settlement of that dispute. In the event that such dispute is not resolved within a period of 30 days from the commencement of such settlement process, such dispute shall be referred to and finally be resolved by arbitration in China in accordance with the rules of the China International Arbitration Centre (“SIAC”) for the time being in force, which rules are deemed to be incorporated by reference in this clause. The tribunal shall consist of a sole arbitrator to be appointed by the Chairman of the SIAC. The language of the arbitration shall be English. Each of the Parties irrevocably submits to the non-exclusive jurisdiction of the courts of China to support and assist the arbitration process pursuant to the foregoing of this paragraph, including if necessary the grant of interlocutory relief pending the outcome of that process.\n' +
    '\n' +
    '          7.Severance and Partial Invalidity\n' +
    '\n' +
    '          7.1 If any of part of this Agreement is rendered void, illegal or unenforceable by any legislation to which it is subject, it shall be rendered void, illegal or unenforceable to that extent and no further and, for the avoidance of doubt, the rest of this Agreement shall continue to be valid and in full force and effect.\n' +
    '\n' +
    '          7.2 The illegality, invalidity or unenforceability of any provision of this Agreement under the law of any jurisdiction shall not affect its legality, validity or enforceability under the law of any other jurisdiction nor the legality, validity or enforceability of any other provision.\n' +
    '\n' +
    '          XI.Others\n' +
    '\n' +
    '          1.You shall fully understand and conform to the laws, regulations and rules in your jurisdictions which are relevant to use of the Services.\n' +
    '          2.During your use of the Services, if you come across any problems, you can contact us through the submission of your feedbacks on BCNote.\n' +
    '          3.This Agreement is accessible for all Users on BCNote. We encourage you to read this Agreement each time you log onto BCNote.\n' +
    '          4.This Agreement shall become effective on Oct 24, 2018.\n' +
    '          As for any issues not covered in this Agreement, you shall comply with the announcements and relevant rules as updated by Company from time to time.\n' +
    '\n' +
    '          Beijing Release Technology Co., Ltd. \n' +
    '\n' +
    '          (Company Registration Number:91110108MA00826JX5)\n'
  },

  privacy_policy: {
    title: 'Privacy Policy',
    content: '          BCNote Privacy Policy\n' +
    '\n' +
    '          Last Updated: November 24, 2018.\n' +
    '\n' +
    '          Dear Users,\n' +
    '\n' +
    '          Beijing Release Technology Co., Ltd.  (“Company”, “we”, “us”, or “our”) respects and protects the privacy of Users (“you”, “your” or “Users”). The Company will collect, use, disclose and process your Personal Information, in accordance with this Privacy Policy (“Policy”) when you:\n' +
    '\n' +
    '          (a) access or use our website and mobile applications (“Applications”) and services; and/or\n' +
    '\n' +
    '          (b) provide us with your Personal Information, regardless or the medium through which such Personal Information is provided.\n' +
    '\n' +
    '          The Company recommends that you shall carefully read and understand the whole contents of this Policy before your use of the Applications. Additionally, significant information including the Disclaimer is in bold form in this Policy. Definitions of key words in this Policy are consistent with those in the BCNote Terms of Service of the Company. If there is any discrepancy between the definitions of any defined term used in this Policy and the BCNote Terms of Service , the definition of any defined term used in this Policy shall prevail.\n' +
    '\n' +
    '          By providing us with your Personal Information, you consent to our collection, use, disclosure (including transfer) and processing of your Personal Information in accordance with this Policy. Please DO NOT provide any Personal Information to us if you do not accept this Policy.\n' +
    '\n' +
    '          The Company reserves the right to update this Policy online from time to time, without notice to you, and the revised Policy will come into effect and supersede the older versions once posted on our Applications. The revised Policy will apply to Personal Information provided to us previously. In particular, if you do not accept the revised Policy, please immediately stop your use of the Applications. Your continuous use of our Applications will be regarded as your acceptance of the revised policy.\n' +
    '\n' +
    '          1. Information We Collect\n' +
    '\n' +
    '          1.1 We collect your Personal Information, including but not limited to your mobile device information, operation records, transaction records and identity addresses.\n' +
    '          1.2 In order to satisfy your needs or requests for specific services, we may also collect Personal Information including but not limited to your name, bank card number, telephone number, email address etc.\n' +
    '          1.3 You confirm that your identity Password, Private Key, Mnemonic Words, Keystore on the Applications are not stored or synchronized on the Company’ servers. The Company does not offer the service to recover your identity Password, Private Key, Mnemonic Words or Keystore.\n' +
    '          1.4 We may also request for you to provide us with additional Personal Information in order for us to enable your use of any specific functions of the Applications. Your refusal to provide us with the requested Personal Information will be considered as your choice to not use a particular specific function of the Applications.\n' +
    '          1.5 To the extent permitted by applicable laws and regulations, the Company may collect and use the Personal Information in the following circumstances without your prior consent or authorization:\n' +
    '          1.5.1 information related to national security and national defense;\n' +
    '          1.5.2 information related to public security, public health, significant public interests;\n' +
    '          1.5.3 information related to criminal investigation, prosecution, trial and enforcement;\n' +
    '          1.5.4 Personal Information in the public domain;\n' +
    '          1.5.5 Personal Information collected from legally publicly disclosed information, such as legal news reports, government information disclosure and other channels;\n' +
    '          1.5.6 Personal Information necessary to maintain the security and compliance of services, such as to detect or to solve the malfunction of products and services; and/or\n' +
    '          1.5.7 other circumstances permitted by laws and regulations.\n' +
    '          1.6 We collect information in the following ways:\n' +
    '          1.6.1 when you provide us with your Personal Information for whatever reasons;\n' +
    '          1.6.2 when you authorize us to obtain your Personal Information from a third party;\n' +
    '          1.6.3 when you register for a user identity on our Applications;\n' +
    '          1.6.4 when you contact us or interact with our employees through various communication channels, for example, through social media platforms, messenger platforms, face-to-face meetings, telephone calls, emails, fax and letters;\n' +
    '          1.6.5 when you transact with us, contact us or request that we contact you;\n' +
    '          1.6.6 when you request to be included in an email or our mailing list; and/or\n' +
    '          1.6.7 when we copy all or part of your transaction records on the blockchain. However, you should refer to the blockchain system for your latest transaction records.\n' +
    '          1.7 Our Applications may contain certain technologies that collect Personal Information in the manner described in this Policy (see paragraph 5 below) or the applicable terms and conditions.\n' +
    '          1.8 Your provision of Personal Information to us is voluntary and you may withdraw your consent for us to use your Personal Information at any time. However, if you choose not to provide us with the Personal Information we require, it may not be possible for you to use the Applications or for us to contact you, or provide products or services which you need from us.\n' +
    '          1.9 In certain circumstances, you may also provide us with the Personal Information of persons other than yourself. If you do so, you warrant that you have informed him/her of the purposes for which we are collecting his/her Personal Information and that he/she has consented to your disclosure of his/her Personal Information to us for those purposes. You agree to indemnify and hold us harmless from and against any and all claims by such individuals relating to our collection, use and disclosure of such Personal Information in accordance with the terms of this Policy.\n' +
    '          1.10 You are responsible for ensuring that all Personal Information that you provide to us is true, accurate and complete. You are responsible for informing us of any changes to your Personal Information.\n' +
    '\n' +
    '          2 How We Use Your Information\n' +
    '\n' +
    '          2.1 We collect, use or disclose your Personal Information for one or more of the following purposes:\n' +
    '          2.1.1 to provide you with products and/or services that you request for;\n' +
    '          2.1.2 to manage your relationship with us;\n' +
    '          2.1.3 to facilitate your use of our Applications;\n' +
    '          2.1.4 to associate you with your identity by the unique serial number of your mobile device;\n' +
    '          2.1.5 to push important notifications to you, such as software update, update of Terms of Service and this Policy;\n' +
    '          2.1.6 to assist with your enquiries, feedback, complaints and requests by using the identity Address and the mobile device information provided by you;\n' +
    '          2.1.7 to notify you of our products, services, programmes and events;\n' +
    '          2.1.8 to resolve any disputes, investigating any complaint, claim or dispute or any actual or suspected illegal or unlawful conduct;\n' +
    '          2.1.9 to conduct our internal audit, data analysis and research;\n' +
    '          2.1.10 to conduct user behavior tracking by tracking the Users’ use of the Applications;\n' +
    '          2.1.11 to comply with our obligations in accordance with laws, regulations and to cooperate with regulatory authorities;\n' +
    '          2.1.12 to comply with international sanctions and applicable regulation for securities and to counter money-laundering or financing of terrorism;\n' +
    '          2.1.13 to enforce obligations owed to us, and contractual terms and conditions; and/or\n' +
    '          2.1.14 any other reasonable purposes related to the aforesaid.\n' +
    '          2.2 If you have consented, we may use your Personal Information, from time to time, for additional purposes such as to inform you of the latest activities, special offers and promotions offered by our strategic business partners, associates and affiliates.\n' +
    '\n' +
    '          3 How You Control Your Own Information\n' +
    '\n' +
    '          You are entitled to control your Personal Information provided to BCNote.\n' +
    '\n' +
    '          3.1 You may import your other identities into BCNote through synchronization of identities and you may export your identities from BCNote to other Tokens management identities. BCNote will display the information of imported identities to you.\n' +
    '          3.2 You may add or delete Tokens, transfer and collect Tokens using the “Identity” column.\n' +
    '          3.3 You acknowledge that since blockchain is an open source system, your transaction records are automatically public and transparent in the whole blockchain.\n' +
    '          3.4 Our Applications may contain links to other websites, applications or Smart Contracts that are not owned, operated, developed or maintained by us. These links are provided only for your convenience. This Policy only applies to our Applications. When visiting these third party websites, or using these third party applications or Smart Contracts, you understand that the BCNote Terms of Service and BCNote Privacy Policy will no longer apply. You are encouraged to carefully review their privacy policies and related terms of service.\n' +
    '          3.5 You are entitled to ask us to update, revise, and delete your Personal Information and/or withdraw any consent provided to us. \n' +
    '          3.6 We may charge you a fee for responding to your request for access to your Personal Information held by us, or for information about the ways in which we have (or may have) used your Personal Information in the one-year period preceding your request. If a fee is to be charged, we will inform you of the amount beforehand and respond to your request after payment is received. We will endeavour to respond to your request within thirty (30) days, and if that is not possible, we will inform you of the time by which we will respond to you.\n' +
    '          3.7 In many circumstances, we need to use your Personal Information in order for us to provide you with products or services that you require. If you do not provide us with the required Personal Information, or if you withdraw your consent to our use and/or disclosure of your Personal Information for these purposes, it may not be possible for us to continue to serve you or provide you with the products and services that you require.\n' +
    '\n' +
    '          4 Information We may Share or Transfer\n' +
    '\n' +
    '          4.1 We will keep your Personal Information for so long as we need the Personal Information for our business and legal purposes.\n' +
    '\n' +
    '          4.2 We do not sell, trade or otherwise transfer your Personal Information to third parties without your consent.\n' +
    '\n' +
    '          4.3 If you have consented to our disclosure of your Personal Information to our strategic business partners and associates, we may disclose your Personal Information to them. They will use your Personal Information only for the purposes you have consented to.\n' +
    '\n' +
    '          4.4 You agree that we may disclose or share your Personal Information with third parties such as:\n' +
    '\n' +
    '          4.4.1 service providers and data processors working on our behalf and providing services to us such as conducting know-your-clients checks, identitying, data processing or management services, website hosting, maintenance and operation services, e-mail message services, analysis services, handling of payment transactions, marketing etc; and\n' +
    '          4.4.2 our consultants and professional advisors (such as accountants, lawyers, auditors).\n' +
    '          4.5 If we need to transfer your Personal Information to any country for the purposes set out above, we shall obtain your prior consent and ensure that the recipient of the Personal Information protects your Personal Information to the same level as we have committed to protecting your Personal Information. Where these countries or territories do not have personal data protection laws that are comparable to the laws applicable to our relationship with you, we will enter into legally enforceable agreements with the recipients.\n' +
    '\n' +
    '          4.6 The Company will not share with or transfer your Personal Information to any third party without your prior consent, except for the following circumstances:\n' +
    '\n' +
    '          4.6.1 the collected Personal Information is publicized by yourself;\n' +
    '          4.6.2 the Personal Information is collected from public information which was legally disclosed, such as news (lawfully reported), government information disclosure and other channels;\n' +
    '          4.6.3 in order to abide by applicable laws, regulations, legal procedures, and administrative or judiciary authorities or to enforce our Policy or protect our or others’ rights, property or safety;\n' +
    '          4.6.4 in the case of mergers and acquisitions, if transfer of Personal Information is involved, the Company may require the receivers of Personal Information to be continuously bound by this Policy.\n' +
    '\n' +
    '          5 Automatic Data Collection Technologies\n' +
    '\n' +
    '          5.1 We use Automatic Data Collection Technologies on our Applications. Examples of such technologies include:\n' +
    '          5.1.1 Cookies (or browser cookies). Cookies are small text files which are set by a website or application operator so that your browser or device may be recognised. We may make use of cookies on our Applications to store and track information such as the number of users and their frequency of use, profiles of users and their online preferences. Cookies do not capture information which would personally identify you, but the information collected may be used to assist us in analysing the usage of our Applications and to improve your online experience with us. You can disable the cookies by changing the setting on your browser. However, this may affect the functionality of the Applications.\n' +
    '          5.1.2 Web analytics. Web analytics is the term given to a method for collecting and assessing the behaviour of visitors to websites and mobile applications. This includes the analysis of traffic patterns in order, for example, to determine the frequency of visits to certain parts of a website or mobile application, or to find out what information and services our visitors are most interested in. The web analytics services on our Applications are provided by third-party service providers.\n' +
    '\n' +
    '          6 How We Protect Your Information\n' +
    '\n' +
    '          6.1 If the Company ceases operation, the Company will stop the collection of your Personal Information, and take steps to delete or anonymize your Personal Information held by us within a reasonable period.\n' +
    '          6.2 To protect your Personal Information, the Company may adopt data security techniques, improve internal compliance levels, provide security training for our staff, and set security authority for access to relevant data to protect your Personal Information.\n' +
    '          6.3 We will send you messages about information security in the “Notifications” column and update articles concerning the use of identities and information protection in the “Support” column on our Applications for your reference.\n' +
    '          \n' +
    '          7 Protection for the Minors\n' +
    '\n' +
    '          The following special provisions apply to minors who are under the age of 18 years old:\n' +
    '\n' +
    '          7.1 The minors shall not use BCNote without the guidance from their parents or guardians.\n' +
    '          7.2 The parents and guardians of the minors shall provide guidance to the minors on using BCNote after they read this Policy, BCNote Terms of Service and other relevant rules.\n' +
    '          7.3 BCNote will ensure the confidentiality and security of the minors’ Personal Information in accordance with the applicable laws and regulations.\n' +
    '\n' +
    '          8 Disclaimer\n' +
    '\n' +
    '          8.1 After you access the websites, applications or Smart Contracts operated by third parties, you acknowledge that this Policy no longer applies to the collection, use, disclosure and transfer of your Personal Information by these third parties. The Company is unable to guarantee that these third party websites, applications and/or Smart Contracts will implement reasonable security measures to protect your Personal Information.\n' +
    '          8.2 You are solely responsible for your use of these third party websites, applications and/or Smart Contracts and agree that you will not hold the Company liable for any damages incurred or injuries inflicted as a result of the collection, use, disclosure and transfer of your Personal Information by these third party websites, applications and/or Smart Contracts.\n' +
    '          8.3 YOU ACKNOWLEDGE AND ACCEPT THAT, TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, THE COMPANY WILL ADOPT MEASURES AS REASONABLE AS POSSIBLE TO PROTECT YOUR PERSONAL INFORMATION UNDER CURRENT TECHNIQUES ON AN “AS IS”, “AS AVAILABLE” AND “WITH ALL FAULTS” BASIS, TO AVOID THE DISCLOSURE, TAMPERING OR DAMAGE OF INFORMATION. SINCE THE COMPANY TRANSFERS DATA WIRELESSLY, THE COMPANY MAKES NO GUARANTEE ON THE PRIVACY AND SECURITY OF WIRELESS INTERNET DATA TRANSFERRING.\n' +
    '\n' +
    '          9 Miscellaneous\n' +
    '\n' +
    '          9.1 You shall fully understand and conform to the laws, regulations and rules in your jurisdictions which are relevant to use of the services provided by the Company.\n' +
    '          9.2 The validity, interpretation, alternation, enforcement, dispute resolution of this Policy and its revised versions shall be governed and construed in accordance with the laws of China. Where there is no applicable law, this Policy shall be interpreted by applicable commercial and/or industrial practices. If any dispute or claim in connection with this Policy arises between you and the Company, the parties shall first attempt to resolve the dispute or claim through amicable negotiations in good faith. If the parties cannot reach an agreement, either party may sue the other party at the competent court in China.\n' +
    '          9.3 You may access this Policy and other terms (e.g. BCNote Terms of Service) through our Applications. We encourage you to check the BCNote Terms of Service and Policy of the Company each time you log onto our Applications.\n' +
    '          9.4 Any translated versions of this Policy are provided for the convenience of Users, and are not intended to amend the original English version of this Policy. If there is any discrepancy between the English version and non-English version of this Policy, the English version shall prevail.\n' +
    '          9.5 This Policy shall become effective on November 24, 2018.\n' +
    '          As for any issues not covered in this Policy, you shall comply with the announcements and relevant rules as updated by the Company from time to time.\n' +
    '\n' +
    '          Beijing Release Technology Co., Ltd. \n' +
    '\n' +
    '          (Company Registration Number: 91110108MA00826JX5)'
  },

  about: {
    title: 'About US',
    donate: 'Donate',
    address: 'Donate Address'
  }
};
