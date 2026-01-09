import cors from 'cors';

import dotenv from 'dotenv';

import express from 'express';

import mongoose from 'mongoose';



const app = express();

dotenv.config();



const corsOptions = {

  origin: '*',

  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],

  allowedHeaders: ['Content-Type'],

  credentials: true,

};



app.use(cors(corsOptions));      // ✅ Needed

app.use(express.json());         // ✅ Needed





mongoose.connect(process.env.MONGODB_URI , { 

    useNewUrlParser: true, 

    useUnifiedTopology: true 

});



const studentSchema = new mongoose.Schema({

    name: String,

    index_no: String,

    programme: String,

    level: String,

    myip: String, // ✅ add this line

    doubtChecker: String,

    checkedTime: String,

    location: {

        lat: Number,

        lon: Number,

    },

}, { timestamps: true });



// // Define the model once at the top level

// const Student = mongoose.model("Student", studentSchema);



// app.post('/api/host-details', async (req, res) => {

//     try {

//         const programName = req.body.programme;  // Fixed variable name (was using undeclared 'programme')

//         // Create dynamic model if needed

//         const ProgramModel = mongoose.model("Programme", studentSchema, programName);

        

//         // Save the data

//         await ProgramModel.create(req.body);

//         console.log(programName)

//         res.json({ success: true });

//     } catch (err) {

//         res.status(400).json({ error: err.message });

//     }

// });



app.post("/api/host-details", async (req, res) => {

    try {

        const {name, index_no, programme, level, myip, location} = req.body;

    

        // Check if collection exists first

        const collections = await mongoose.connection.db.listCollections({ name: programme }).toArray();

        if (collections.length > 0) {

        return res.json({ dbAvailable: true });

        }



        if(index_no !== "") {



            const usernameChecker = index_no.replace(/[.\s]/g,"");
        
            const schoolCode = usernameChecker[0]==="S" ? 
                               usernameChecker.substring(0,5) : 
                               usernameChecker.substring(0,3);
        
            const departmentalCode = usernameChecker.substring(5,8);
        
            // const schoolYear = usernameChecker.slice(-2);
        
            const departmentalCodesArray = ["002","003","005","007","006","008","010","024","028"];
        
            const isSpecialUser = schoolCode === "901";
        
        
            if ( !isSpecialUser && ( schoolCode !== "SRI41" || !departmentalCodesArray.includes(departmentalCode) || usernameChecker.length !== 13 ) ){
        
                console.log("nooooooooooooooooooo");
                return res.json({ success: false });
        
            }

        }



        // Create dynamic model if needed

        const Student = mongoose.model("Programme", studentSchema, `${programme}`);

        

        // Save the data

        const newStudent = await Student.create({

            name,

            index_no,

            programme,

            level,

            myip,

            location,

            doubtChecker: "0",

          checkedTime: new Date().toLocaleTimeString([], {hour: "2-digit", minute: "2-digit"}),

        });

        res.status(201).json(newStudent);



    } catch (err) {

        res.status(400).json({ error: err.message });

    }

});





app.post("/api/checkin-details", async (req, res) => {

  try {

    const { name, index_no, programme, level, myip } = req.body;



    // Check if collection exists first

    const collections = await mongoose.connection.db.listCollections({ name: programme }).toArray();

    if (collections.length === 0) {

      return res.json({ dbAvailable: false });

    }


    const usernameChecker = index_no.replace(/[.\s]/g,"");

    const schoolCode = usernameChecker[0]==="S" ? 
                       usernameChecker.substring(0,5) : 
                       usernameChecker.substring(0,3);

    const departmentalCode = usernameChecker.substring(5,8);

    // const schoolYear = usernameChecker.slice(-2);

    const departmentalCodesArray = ["002","003","005","007","006","008","010","024","028"];

    const isSpecialUser = schoolCode === "901";


    if ( !isSpecialUser && ( schoolCode !== "SRI41" || !departmentalCodesArray.includes(departmentalCode) || usernameChecker.length !== 13 ) ){

        console.log("nooooooooooooooooooo");
        return res.json({ success: false });

    }



    // Now safely define the model

    const Student = mongoose.models[programme];


    // Check if student already exists

    const user = await Student.findOne({index_no});



    const ipCounter = await Student.countDocuments({myip});



    if (user) {

      return res.json({ alreadyCheckedIn: true });

    }



    // Save the new student

    const newStudent = await Student.create({

      name,

      index_no,

      programme,

      level,

      myip,

      doubtChecker: ipCounter > 0 ? "1" : "0",

      checkedTime: new Date().toLocaleTimeString([], {hour: "2-digit", minute: "2-digit"}),

    });



    res.status(201).json(newStudent);

  } catch (err) {

    res.status(400).json({ error: err.message });

  }

});







app.get("/api/host-location", async (req, res) => {

    try {

        const { programme } = req.query;





        if (!programme) {

            return res.status(400).json({ error: "Programme is required" });

        }



        const Student = mongoose.model("Programme", studentSchema, programme);

        const host = await Student.findOne();



        if (!host || !host.location) {

            return res.status(404).json({ error: "Host not found" });

        }



        res.json({ location: host.location });

    } catch (err) {

        console.error(err);

        res.status(500).json({ error: err.message });

    }

});



app.get("/api/student-list", async (req,res) =>{



    try{

    const { programme } = req.query;

    const Student = mongoose.model("Programme", studentSchema, programme);

    const studentList = await Student.find({},{name: 1, index_no: 1, doubtChecker: 1, checkedTime: 1, _id: 0});

    console.log(programme);



    res.json(studentList);

    }

    catch(err){

        console.log(`Getting names error: ${err}`)

    }

}



)





app.delete("/api/delete-collection",async(req,res)=> {



    const {collection_name} = req.body;



    if(!collection_name){

        return res.json("No collection found");

    }



    try{

        const db =  await mongoose.connection.collection(collection_name);

        await db.drop();

        res.status(200).json({message:`Document saved successfully`});

    }

    catch(error){

        if(error.code == 26){

            return res.status(404).json({message: `Document does not exist`});

        }

        else{

            return res.status(500).json({message: `Error saving document`});

        }



    }

}





)





const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {

  console.log(`Server running on port ${PORT}`);

});







              



