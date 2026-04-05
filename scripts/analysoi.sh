echo " ANALYSIS REPORT " > analysis_report.txt
echo "Detected languages:" >> analysis_report.txt
find . -type f -name "*.py" | grep -q . && echo "- Python" >> analysis_report.txt
find . -type f -name "*.java" | grep -q . && echo "- Java" >> analysis_report.txt
find . -type f -name "*.js" | grep -q . && echo "- JavaScript" >> analysis_report.txt
find . -type f -name "*.ts" | grep -q . && echo "- TypeScript" >> analysis_report.txt
find . -type f -name "*.sh" | grep -q . && echo "- Shell" >> analysis_report.txt
find . -type f -name "*.html" | grep -q . && echo "- HTML" >> analysis_report.txt
find . -type f -name "*.css" | grep -q . && echo "- CSS" >> analysis_report.txt
echo "" >> analysis_report.txt
echo "Design patterns detected:" >> analysis_report.txt

grep -R "getInstance" -n . && echo "- Singleton" >> analysis_report.txt
grep -R "create[A-Z]" -n . && echo "- Factory Method" >> analysis_report.txt
grep -R "notify" -n . && echo "- Observer" >> analysis_report.txt
grep -R "Strategy" -n . && echo "- Strategy" >> analysis_report.txt
grep -R "Decorator" -n . && echo "- Decorator" >> analysis_report.txt

cat analysis_report.txt