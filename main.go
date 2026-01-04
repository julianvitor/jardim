package main
import(
	"fmt"
	"net/http"
	"log"
)

func main(){
	app := http.NewServeMux()
	app.HandleFunc("/", HomeHandler)
	fmt.Println("servidor iniciado em http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080",app))
}

func HomeHandler(w http.ResponseWriter, r *http.Request){
	http.ServeFile(w,r, "./static/index.html")
}

