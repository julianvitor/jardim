package main
import(
	"fmt"
	"net/http"
	"log"
)

func main(){
	mux := http.NewServeMux()
	mux.HandleFunc("/", home)
	fmt.Println("servidor iniciado em http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080",mux))
}

func home(w http.ResponseWriter, r *http.Request){
	http.ServeFile(w,r, "./static/index.html")
}

