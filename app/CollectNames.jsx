import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import Papa from "papaparse";
import { useEffect, useState } from "react";

export default function CollectNames({ timeUp, defaultTimeUp, programmeName }) {
  const [students, setStudents] = useState([]);
  console.log("here is workingggggggggggg");

  const getAllNames = async () => {
    try {
      const response = await fetch(
        `https://attendict-apk.onrender.com/api/student-list?programme=${programmeName}`
      );
      const students = await response.json();
      return students;
    } catch (err) {
      console.log(`Couldn't get names: ${err}`);
    }
  };

  const deleteCollection = async () => {
    try{
      const response = await fetch("https://attendict-apk.onrender.com/api/delete-collection",
        {
          method:"DELETE",
          headers:{"Content-Type":"application/json"},
          body: JSON.stringify({collection_name:programmeName})
        }
      )

    }

    catch(error){

      console.log("Couldn't delete");
    }

  }

  useEffect(() => {
    let fetchNamesInterval;
    console.log("here is tooooooooooooooooooo");


    if (timeUp === true) {
        console.log("yeahhhhhhhhhhhhhhhhhhhhhhh")
      getAllNames().then(async () => {
        if (!students || students.length === 0) {
          deleteCollection();
          setStudents([]);
          defaultTimeUp(false);
          alert("Document couldn't be saved. Check internet connection and try again");
          return;
        }

        const date = new Date();

        console.log("niceeeeeeeeeeeeeeeeeeeeeeeeeeeee")

        // ✅ Sort students alphabetically by name
        students.sort((a, b) => a.name.localeCompare(b.name));

        // Prepare data for CSV
        const csvData = students
          .filter(student => student.name !== "" && student.index_no !== "")
          .map((student, index) => [
            index + 1,
            student.name,
            student.index_no,
            student.checkedTime || "",
            student.doubtChecker === "1" ? "Check if in class" : "Present"
          ]);


        // Generate CSV string
        const csv = Papa.unparse({
          fields: ["S/N", "Name", "Index Number", "Checked Time", "Status"],
          data: csvData,
        });

        try {
          // ✅ Save CSV file in app’s document directory
          const safeDate = date.toISOString().split("T")[0];
          const filename = `${programmeName}_${safeDate}.csv`;

          // First, write to a temporary cache file
          const tempUri = FileSystem.cacheDirectory + filename;
          await FileSystem.writeAsStringAsync(tempUri, csv, { encoding: "utf8" });

          // ✅ Request user permission to access Documents folder
          const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
          if (!permissions.granted) {
            alert("Permission not granted to save file.");
            return;
          }

          // ✅ Create the file inside the chosen folder (Documents)
          const base64 = await FileSystem.readAsStringAsync(tempUri, {
            encoding: FileSystem.EncodingType.Base64,
          });

          const newFileUri = await FileSystem.StorageAccessFramework.createFileAsync(
            permissions.directoryUri,
            filename,
            "text/csv"
          );

          await FileSystem.writeAsStringAsync(newFileUri, base64, {
            encoding: FileSystem.EncodingType.Base64,
          });

          deleteCollection();          

          alert("Document saved successfully ✅");

          // Optional: let user share immediately
          if (await Sharing.isAvailableAsync()) {
            defaultTimeUp(false);
            await Sharing.shareAsync(tempUri);
          } else {
            console.log("Sharing not available, file saved at:", newFileUri);
          }

          setStudents([]);
        } catch (err) {
          console.log("Error saving file:", err);
          defaultTimeUp(false);
          alert("Couldn't save file 😥");
        }
      });
    } else {
      // Poll for student list every 5s until timeUp
      fetchNamesInterval = setInterval(() => {
        getAllNames().then((fetchedStudents) => {
          if (fetchedStudents) {
            console.log("takerrrr");
            console.log(fetchedStudents);
            setStudents(fetchedStudents);
          }
        });
      }, 5000);
    }

    return () => {
      if (fetchNamesInterval) clearInterval(fetchNamesInterval);
    };
  }, [timeUp, programmeName]);

  return null;
}
