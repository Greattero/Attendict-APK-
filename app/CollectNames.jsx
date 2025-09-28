import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import Papa from "papaparse";
import { useEffect, useState } from "react";

export default function CollectNames({ timeUp, programmeName }) {
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

  useEffect(() => {
    let fetchNamesInterval;
    console.log("here is tooooooooooooooooooo");


    if (timeUp === true) {
        console.log("yeahhhhhhhhhhhhhhhhhhhhhhh")
      getAllNames().then(async () => {
        if (!students || students.length === 0) {
          alert("Document couldn't be saved. Check internet connection and try again");
          return;
        }

        const date = new Date();

        console.log("niceeeeeeeeeeeeeeeeeeeeeeeeeeeee")

        // ✅ Sort students alphabetically by name
        students.sort((a, b) => a.name.localeCompare(b.name));

        // Prepare data for CSV
        const csvData = students.map((student, index) => [
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
          const fileUri =
            FileSystem.documentDirectory + `${programmeName}_${safeDate}.csv`;

            await FileSystem.writeAsStringAsync(fileUri, csv, {
            encoding: "utf8",
            });

          alert("Document saved successfully ✅");

          // Optional: let user share immediately
          if (await Sharing.isAvailableAsync()) {
            await Sharing.shareAsync(fileUri);
          } else {
            console.log("Sharing not available, file saved at:", fileUri);
          }

          setStudents([]);
        } catch (err) {
          console.log("Error saving file:", err);
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
