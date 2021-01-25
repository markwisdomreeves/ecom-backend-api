import fetch from "node-fetch"


const CreateNewsLettersCtr = {
    NewsLetterSignUp: (req, res) => {
        const { firstName, lastName, email } = req.body

        if (!firstName || !lastName || !email) {
            redirect('/fail.html');
            return;
        }

        // construct req data
        const data = {
            members: [
                {
                    email_address: email,
                    status: 'subscribed',
                    merge_fields: {
                        FNAME: firstName,
                        LNAME: lastName
                    }
                }
            ]
        };

        const postData = JSON.stringify(data);

        fetch(`https://usX.api.mailchimp.com/3.0/lists/${process.env.MAIL_CHIMP_YOUR_AUDIENCE_ID}`, {
            method: 'POST',
            headers: {
                Authorization: process.env.MAIL_CHIMP_API_KEY
            },
            body: postData
        })
        .then(res.statusCode === 200 ? 
            res.redirect('/success.html') : 
            res.redirect('/fail.html'))
        .catch(error => console.log(error))

    }
}


export default CreateNewsLettersCtr;