package app;

import javafx.application.Application;
import javafx.event.ActionEvent;
import javafx.event.EventHandler;
import javafx.fxml.FXMLLoader;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.scene.image.Image;
import javafx.scene.layout.StackPane;
import javafx.stage.Stage;

/**
 * CreateBoard
 */

public class CreateBoard extends Application {

  public static void main(String[] args) {
    launch(args);
  }

  @Override
  public void start(Stage primaryStage) throws Exception {
    primaryStage.setTitle("Curios Chess Game");
    primaryStage.getIcons().add(new Image("app/resources/images/strategy.png"));
    // primaryStage.getIcons().add(new Image("app/curios_chess_icon.png"));
    /*
     * Button btn = new Button("Click Me!"); btn.setOnAction(new
     * EventHandler<ActionEvent>() {
     * 
     * @Override public void handle(ActionEvent event) {
     * System.out.println("Hello There!!!!"); } });
     * 
     * StackPane root = new StackPane(); root.getChildren().add(btn);
     */

    Parent root = FXMLLoader.load(getClass().getResource("views/Model.fxml"));
    Scene scene = new Scene(root, 900, 600);
    scene.getStylesheets().add("app/stylesheets/style.css");
    primaryStage.setScene(scene);
    primaryStage.show();
  }
}