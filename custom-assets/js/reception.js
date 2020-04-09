const resetForm = () => document.getElementById("form-generate-token").reset()

const handleSubmit = () => {
    const form = document.getElementById("form-generate-token")
    let formData = new FormData(form)

    const email = formData.get('email')
    const vehicleNumber = formData.get('vehicle-number')
    const ref = firebase.database().ref('customers')
    ref
        .orderByChild("email")
        .equalTo(email)
        .once("value", snapshot => {
            if (!snapshot.exists()) {
                const fname = formData.get('first-name')
                const lname = formData.get('last-name')
                const contact = formData.get('contact')
                const complainant = formData.get('complainant') == "on" ? "Yes" : "No"
                const address = formData.get('address')
                const city = formData.get('city')
                const postal = formData.get('postal')
                const vehicleBrand = formData.get('vehicle-brand')

                let customerKey = insertData(fname, lname, email, contact, complainant, address, city, postal, vehicleNumber, vehicleBrand);
                let tokenNumber = generateToken(customerKey, vehicleNumber)
                alert("Your token number is: " + tokenNumber)

            } else {
                let customerKey = Object.keys(snapshot.val())[0]
                firebase.database().ref('customers').child(customerKey).child("complainant").set(
                    formData.get('complainant') == "on" ? "Yes" : "No"
                )
                let tokenNumber = generateToken(customerKey, vehicleNumber)
                alert("Your token number is: " + tokenNumber)

            }
        })
}

const insertData = (fname, lname, email, contact, complainant, address, city, postal, vehicleNumber, vehicleBrand) => {

    const ref = firebase.database().ref('customers')
    let newCustomerRef = ref.push({
        fname: fname,
        lname: lname,
        email: email,
        contact: contact,
        complainant: complainant,
        address: address,
        city: city,
        postal: postal,
        vehicleNumber: vehicleNumber,
        vehicleBrand: vehicleBrand
    })
    return newCustomerRef.key

}

const generateToken = (customerKey, vehicleNumber) => {
    const ref = firebase.database().ref('tokens')
    let newToken = ref.push({
        customerKey: customerKey,
        vehicleNumber: vehicleNumber,
        createdAt: window.firebase.database.ServerValue.TIMESTAMP
    })
    return newToken.key
}

const fetchTokenList = () => {
    const ref = firebase.database().ref('tokens')
    ref.on("value", snapshot => {
        snapshot.forEach(childSnapshot => {
            let tokenKey = childSnapshot.key
            let tokenData = childSnapshot.val()
            console.log(tokenData);

        })
    })
}